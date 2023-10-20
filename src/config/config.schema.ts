import { z } from 'zod';

export const configurationSchema = z.object({
  POSTGRES_HOST: z.string().trim().default('localhost'),
  POSTGRES_PORT: z.coerce.number().int().default(5432),
  POSTGRES_DB: z.string().trim(),
  POSTGRES_USER: z.string().trim(),
  POSTGRES_PASSWORD: z.string().trim(),
  API_PORT: z.coerce.number().int().default(3000),
  API_KEY: z.string().trim(),
  REQUEST_TIMEOUT: z.coerce.number().int().default(5000),
  THROTTLE_TTL: z.coerce.number().int().default(1000),
  THROTTLE_LIMIT: z.coerce.number().int().default(10),
  MINIO_HOST: z.string().trim().default('localhost'),
  MINIO_PORT: z.coerce.number().int().default(9000),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  MINIO_ACCESS_KEY: z.string().trim(),
  MINIO_SECRET_KEY: z.string().trim(),
  MINIO_BUCKET_NAME: z.string().trim(),
  MINIO_REGION: z.string().trim(),
});
