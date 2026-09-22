export const dynamic = "force-static";
export function GET() {
 return Response.json({release:"2026-09-22-master-implementation",commit:process.env.BACWATER_BUILD_COMMIT||"unavailable"},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
}
