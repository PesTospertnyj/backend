import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const productionConfig = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.json(),
  ),
};
const developmentConfig = {
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
};

const getConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return productionConfig;
  }

  return developmentConfig;
};

export const winstonConfig = WinstonModule.createLogger({
  transports: [new winston.transports.Console(getConfig())],
});
