require('dotenv').config();

const ENV = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || 'xxx',
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY || 'xxx',
  HOST: process.env.HOST || 'https://xxx.ngrok.io',
  API_VERSION: process.env.PORT || '2020-04',
  PORT: process.env.PORT || '3000',

  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_NAME: process.env.DB_NAME || 'dbName',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'root',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'secureKey',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1y',

  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = { ENV };
