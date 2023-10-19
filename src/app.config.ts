export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  port: parseInt(process.env.PORT) || 3000,
  api_key: process.env.API_KEY,
  request_timeout: parseInt(process.env.REQUEST_TIMEOUT) || 5000,
  throttle_ttl: parseInt(process.env.THROTTLE_TTL) || 1000,
  throttle_limit: parseInt(process.env.THROTTLE_LIMIT) || 10,
});
