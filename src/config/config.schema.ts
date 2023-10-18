import { z } from 'zod';

export const configurationSchema = z.object({
  POSTGRES_HOST: z.string().trim(),
  POSTGRES_PORT: z.coerce.number().int().default(5432),
  POSTGRES_DB: z.string().trim(),
  POSTGRES_USER: z.string().trim(),
  POSTGRES_PASSWORD: z.string().trim(),
  API_PORT: z.coerce.number().int().default(3000),
  API_KEY: z.string().trim(),
  REQUEST_TIMEOUT: z.coerce.number().int().default(5000),
});
