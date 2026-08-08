import { NextRequest, NextResponse } from "next/server";
import { customObfuscate, generateCustomNameObfuscation } from "@/lib/encrypt";
import { useCredit } from "@/lib/auth";

const RATE_LIMITS: Record<string, number> = {
  free: 30_000,
  premium_monthly: 10_000,
  premium_yearly: 10_000,
  max: 5_000,
};

const lastRequest: Record<string, number> = {};

export async function POST(req: NextRequest) {
  try {
    const { code, mode, customName, username } = await req.json();

    if (!code || !mode || !username) {
      return NextResponse.json({ error: "Code, mode, and username required" }, { status: 400 });
    }

    // Rate limit check
    const now = Date.now();
    const last = lastRequest[username] || 0;
    const userData = await import("@/lib/auth").then((m) => m.getUser(username));
    const plan = userData?.plan || "free";
    const limit = RATE_LIMITS[plan] || 30_000;
    if (now - last < limit) {
      return NextResponse.json(
        { error: `Rate limit: please wait ${Math.ceil((limit - (now - last)) / 1000)}s` },
        { status: 429 }
      );
    }
    lastRequest[username] = now;

    // Credit check
    const cost = mode === "customname" ? 2 : 1;
    const creditResult = await useCredit(username, cost);
    if (!creditResult.success) {
      return NextResponse.json(
        { error: creditResult.message || "Credit limit reached" },
        { status: 403 }
      );
    }

    let result: string;

    if (mode === "customname") {
      if (!customName || customName.trim().length < 2) {
        return NextResponse.json(
          { error: "Custom name required (min 2 chars) for customname mode" },
          { status: 400 }
        );
      }
      result = generateCustomNameObfuscation(code, customName.trim());
    } else {
      result = await customObfuscate(code, mode);
    }

    return NextResponse.json({ result, user: creditResult.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Encryption failed" },
      { status: 500 }
    );
  }
}
