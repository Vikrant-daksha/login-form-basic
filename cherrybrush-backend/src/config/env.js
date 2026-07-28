import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_KEY: z.string(),
  SECRET_KEY: z.string().startsWith("sk_"),
  REDIS_URL: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid Environment Variables:", z.treeifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;
