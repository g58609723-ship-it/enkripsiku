import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }
    const user = await getUser(username);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
