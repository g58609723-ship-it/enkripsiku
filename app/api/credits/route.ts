import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    plans: [
      {
        id: "free",
        name: "FREE",
        price: 0,
        features: ["5 credits / day", "Custom name: 2 credits", "Rate limit: 30s", "All encryption types"],
        color: "#00ff41",
        glow: "0 0 20px #00ff4133",
      },
      {
        id: "premium_monthly",
        name: "PREMIUM / MONTH",
        price: 15000,
        features: ["∞ credits for 30 days", "Rate limit: 10s", "All encryption types", "Priority support"],
        color: "#ff00ff",
        glow: "0 0 30px #ff00ff55",
      },
      {
        id: "premium_yearly",
        name: "PREMIUM / YEAR",
        price: 100000,
        features: ["∞ credits for 365 days", "Rate limit: 10s", "All encryption types", "Priority support"],
        color: "#ff00ff",
        glow: "0 0 30px #ff00ff55",
      },
      {
        id: "max",
        name: "MAX",
        price: 200000,
        features: ["∞ credits FOREVER", "Rate limit: 5s", "All encryption types", "Priority support", "Early access"],
        color: "#ffd700",
        glow: "0 0 40px #ffd70088",
      },
    ],
  });
}
