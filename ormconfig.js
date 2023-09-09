module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'backend',
  entities: ['dist/**/*.entity.js'],
  migrations: ['/dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
