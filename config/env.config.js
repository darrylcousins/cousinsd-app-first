require('dotenv').config();

const ENV = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  HOST: process.env.HOST,
  API_VERSION: process.env.API_VERSION,
  PORT: process.env.PORT,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DIALECT: process.env.DB_DIALECT,

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,

  NODE_ENV: process.env.NODE_ENV,
};

module.exports = { ENV };
