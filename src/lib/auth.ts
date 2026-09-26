import { passwordStamp } from "@/lib/security/password-reset";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { storedRole } from "@/lib/security/authorization";
import { takeActionBudget } from "@/lib/security/action-budget";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(72).refine(value => Buffer.byteLength(value, "utf8") <= 72),
});

/** JWT roles are checked against the stored user on every request. Keep AUTH_SECRET stable across deployments. Deleting a database Session row does not revoke a JWT. */
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
        if (!await takeActionBudget("signin", email)) return null;
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
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      const id = typeof token.id === "string" ? token.id : token.sub;
      token.role = "user";
      if (!id) { token.id = undefined; return token; }
      try {
        const stored = await prisma.user.findUnique({
          where: { id }, select: { id: true, role: true, name: true, image: true, hashedPassword: true },
        });
        if (!stored) { token.id = undefined; return token; }
        const stamp = passwordStamp(stored.hashedPassword);
        if (user) token.passwordStamp = stamp;
        else if (token.passwordStamp !== undefined && token.passwordStamp !== stamp) { token.id = undefined; token.sub = undefined; return token; }
        else if (token.passwordStamp === undefined) {
          const revoked = await prisma.verificationToken.findUnique({ where: { token: `password-session:${id}` } });
          if (revoked && revoked.expires > new Date()) { token.id = undefined; token.sub = undefined; return token; }
          token.passwordStamp = stamp;
        }
        token.id = stored.id; token.role = storedRole(stored);
        token.name = stored.name; token.picture = stored.image;
      } catch { token.id = undefined; }
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
