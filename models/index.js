const { Sequelize } = require('sequelize');
const { ENV } = require('../config/env.config');
const Shop = require('./shop.model');

const sequelize = new Sequelize({
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  port: ENV.DB_PORT,
  dialect: ENV.DB_DIALECT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  operatorsAliases: false,
  logging: false,
  storage: ':memory:',
});

module.exports = { 
  sequelize: sequelize,
  Shop: Shop(sequelize)
};

