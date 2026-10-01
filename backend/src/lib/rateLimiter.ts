import { Redis } from "@upstash/redis";

const upstash = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MAX_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || "200");

function hourKey(sender: string) {
  const hour = Math.floor(Date.now() / 3_600_000);
  return `rate:${sender}:${hour}`;
}

export async function checkAndIncrement(sender: string): Promise<boolean> {
  const key = hourKey(sender);
  const count = await upstash.incr(key);
  if (count === 1) await upstash.expire(key, 7200);
  return count <= MAX_PER_HOUR;
}

export function msUntilNextHour(): number {
  const now = Date.now();
  return 3_600_000 - (now % 3_600_000);
}

export async function getCurrentCount(sender: string): Promise<number> {
  const val = await upstash.get<number>(hourKey(sender));
  return val ?? 0;
}
