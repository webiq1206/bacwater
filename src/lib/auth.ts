import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Session strategy:
 *   Credentials-based signins can't use the database session strategy in
 *   Auth.js v5 (the adapter path only fires on OAuth). So we sign a JWT
 *   for credentials, but also record a persistent Session row keyed off
 *   the same sub. This way:
 *     - Redeploys never invalidate anyone as long as AUTH_SECRET is stable.
 *     - Server code can look up the persistent Session in the DB if it needs
 *       to (e.g. to force-signout a user by deleting their Session row).
 *   AUTH_SECRET MUST be set once in the Replit Secrets panel and never
 *   rotated. Rotating it will invalidate existing session cookies.
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,   // refresh cookie once per day
  },
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user || !user.hashedPassword) return null;
        const ok = await bcrypt.compare(password, user.hashedPassword);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Fresh sign-in: user object is populated.
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? "user";
      }

      // Every request: rehydrate role/name from the DB so the source of
      // truth is the User row, not the cookie. This makes /admin/users
      // role changes apply on the next request, and prevents stale data
      // in the JWT from persisting after a redeploy.
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, name: true, image: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.name = dbUser.name ?? token.name;
            token.picture = dbUser.image ?? token.picture;
          }
        } catch {
          // DB unavailable during middleware - keep existing token values
          // so the user stays signed in rather than getting bounced.
        }
      }

      // ADMIN_EMAILS always wins.
      if (token.email && adminEmails.includes((token.email as string).toLowerCase())) {
        token.role = "admin";
      }
      // Silence unused-parameter warning.
      void trigger;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role =
          (token.role as string) || "user";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
