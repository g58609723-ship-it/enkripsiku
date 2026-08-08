import { getDB, saveDB, User } from "./jsonbin";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function checkAndResetDaily(user: User): User {
  const today = todayStr();
  if (user.lastReset !== today) {
    user.dailyUsed = 0;
    user.lastReset = today;
    if (user.plan === "free") user.credits = 5;
  }
  // Check premium expiry
  if (user.premiumExpiry && new Date() > new Date(user.premiumExpiry)) {
    user.plan = "free";
    user.premiumExpiry = null;
    user.credits = 5;
    user.dailyUsed = 0;
  }
  return user;
}

export async function registerUser(username: string, password: string): Promise<User> {
  const db = await getDB();
  if (db.users.find((u) => u.username === username)) {
    throw new Error("Username already exists");
  }
  const user: User = {
    id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    username,
    password,
    plan: "free",
    credits: 5,
    dailyUsed: 0,
    lastReset: todayStr(),
    premiumExpiry: null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await saveDB(db);
  return user;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const db = await getDB();
  const user = db.users.find((u) => u.username === username && u.password === password);
  if (!user) throw new Error("Invalid username or password");
  const updated = checkAndResetDaily(user);
  // Save if reset happened
  if (updated.lastReset !== user.lastReset || updated.plan !== user.plan) {
    const idx = db.users.findIndex((u) => u.id === user.id);
    db.users[idx] = updated;
    await saveDB(db);
  }
  return updated;
}

export async function getUser(username: string): Promise<User | null> {
  const db = await getDB();
  const user = db.users.find((u) => u.username === username);
  if (!user) return null;
  const updated = checkAndResetDaily(user);
  if (updated.lastReset !== user.lastReset || updated.plan !== user.plan) {
    const idx = db.users.findIndex((u) => u.id === user.id);
    db.users[idx] = updated;
    await saveDB(db);
  }
  return updated;
}

export async function useCredit(
  username: string,
  cost: number = 1
): Promise<{ success: boolean; user?: User; message?: string }> {
  const db = await getDB();
  const idx = db.users.findIndex((u) => u.username === username);
  if (idx === -1) return { success: false, message: "User not found" };

  let user = checkAndResetDaily(db.users[idx]);

  // MAX plan: unlimited forever
  if (user.plan === "max") {
    return { success: true, user };
  }

  // Premium plans: unlimited while active
  if (user.plan.startsWith("premium")) {
    return { success: true, user };
  }

  // Free plan
  if (user.dailyUsed + cost > 5) {
    return {
      success: false,
      user,
      message: "Daily limit reached (5 credits/day). Upgrade your plan!",
    };
  }

  user.dailyUsed += cost;
  db.users[idx] = user;
  await saveDB(db);
  return { success: true, user };
}

export async function upgradePlan(
  username: string,
  plan: "premium_monthly" | "premium_yearly" | "max"
): Promise<User> {
  const db = await getDB();
  const idx = db.users.findIndex((u) => u.username === username);
  if (idx === -1) throw new Error("User not found");

  const user = db.users[idx];
  user.plan = plan;

  if (plan === "premium_monthly") {
    user.premiumExpiry = addDays(new Date(), 30).toISOString();
    user.credits = 999999;
  } else if (plan === "premium_yearly") {
    user.premiumExpiry = addDays(new Date(), 365).toISOString();
    user.credits = 999999;
  } else if (plan === "max") {
    user.premiumExpiry = null;
    user.credits = 999999;
  }

  db.users[idx] = user;
  await saveDB(db);
  return user;
}
