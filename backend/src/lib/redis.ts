import IORedis from "ioredis";

const url = process.env.REDIS_URL || "redis://localhost:6379";
const isTLS = url.startsWith("rediss://");

const redis = new IORedis(url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: false,
  tls: isTLS ? {
    rejectUnauthorized: false,
    requestCert: true,
  } : undefined,
  retryStrategy: (times) => {
    if (times > 3) return null; // stop retrying after 3 attempts
    return Math.min(times * 1000, 3000);
  },
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.warn("Redis:", err.message));

export default redis;
