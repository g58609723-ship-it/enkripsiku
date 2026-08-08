import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }
    const user = await loginUser(username, password);
    // Don't return password
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
