const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'tfgadria',
  password: '5228',
  port: 5432,
}

const poolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'tfgadria',
  password: '5228',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
}

module.exports = {
  config,
  poolConfig
};