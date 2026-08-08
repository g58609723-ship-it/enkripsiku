import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }
    if (username.length < 3 || password.length < 4) {
      return NextResponse.json(
        { error: "Username min 3 chars, password min 4 chars" },
        { status: 400 }
      );
    }
    const user = await registerUser(username, password);
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
