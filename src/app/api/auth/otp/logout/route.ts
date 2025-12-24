// F:\gadocerto-clone\gadocerto-clone\src\app\api\auth\otp\logout\route.ts
import { NextResponse } from "next/server";

function clearCookie(name: string) {
  // Max-Age=0 apaga; Path=/ garante que vale para o site todo
  return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export async function GET() {
  const res = NextResponse.json({ ok: true, cleared: ["gc_logged_in", "otp_phone"] });
  res.headers.append("Set-Cookie", clearCookie("gc_logged_in"));
  res.headers.append("Set-Cookie", clearCookie("otp_phone"));
  return res;
}

export async function POST() {
  const res = NextResponse.json({ ok: true, cleared: ["gc_logged_in", "otp_phone"] });
  res.headers.append("Set-Cookie", clearCookie("gc_logged_in"));
  res.headers.append("Set-Cookie", clearCookie("otp_phone"));
  return res;
}
