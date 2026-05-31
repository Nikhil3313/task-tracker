import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL
});

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

const connectRedis = async () => {
  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await redisClient.connect();

      console.log("Redis Connected");
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(
        `Redis connection failed. Retrying ${attempt}/${maxAttempts}`
      );
      await wait(2000);
    }
  }
};

export {
  redisClient,
  connectRedis
};
