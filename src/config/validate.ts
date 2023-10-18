import { configurationSchema } from './config.schema';

export function validateConfig(config: Record<string, unknown>) {
  return configurationSchema.parse(config);
}
