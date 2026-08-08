// jsonbin.io database helper
const MASTER_KEY = process.env.JSONBIN_MASTER_KEY || "";
const BIN_ID = process.env.JSONBIN_BIN_ID || "";

export interface User {
  id: string;
  username: string;
  password: string;
  plan: "free" | "premium_monthly" | "premium_yearly" | "max";
  credits: number;
  dailyUsed: number;
  lastReset: string;
  premiumExpiry: string | null;
  createdAt: string;
}

interface DB {
  users: User[];
}

async function request(path: string, method: string = "GET", body?: any) {
  const url = path.startsWith("http")
    ? path
    : `https://api.jsonbin.io/v3/b${path}`;

  const opts: any = {
    method,
    headers: {
      "X-Master-Key": MASTER_KEY,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`jsonbin ${method} ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export async function getDB(): Promise<DB> {
  if (!BIN_ID || !MASTER_KEY) {
    throw new Error("JSONBIN_MASTER_KEY and JSONBIN_BIN_ID must be set in .env.local");
  }
  const data = await request(`/${BIN_ID}/latest`);
  return (data.record || { users: [] }) as DB;
}

export async function saveDB(db: DB): Promise<void> {
  if (!BIN_ID || !MASTER_KEY) {
    throw new Error("JSONBIN_MASTER_KEY and JSONBIN_BIN_ID must be set in .env.local");
  }
  await request(`/${BIN_ID}`, "PUT", db);
}
