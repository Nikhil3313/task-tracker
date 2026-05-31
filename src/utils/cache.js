import { redisClient } from "../config/redis.js";

const TASK_LIST_TTL_SECONDS = 60;

export const buildTaskListCacheKey = (query, page, limit) => {
  const assignee = query.assignee?.toString() || "all";
  const status = query.status || "all";
  const priority = query.priority || "all";

  return [
    "tasks",
    query.organization.toString(),
    `assignee=${assignee}`,
    `status=${status}`,
    `priority=${priority}`,
    `page=${page}`,
    `limit=${limit}`
  ].join(":");
};

export const getCachedJson = async (key) => {
  if (!redisClient.isOpen) {
    return null;
  }

  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCachedJson = async (key, value) => {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: TASK_LIST_TTL_SECONDS
    }
  );
};

export const invalidateTaskListCache = async (organizationId) => {
  if (!redisClient.isOpen) {
    return;
  }

  const pattern = `tasks:${organizationId}:*`;

  for await (const key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: 100
  })) {
    await redisClient.del(key);
  }
};
