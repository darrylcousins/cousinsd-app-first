const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const shopRedact = (webhook) => {
  const payload = webhook.payload;
  console.log('Received shop redact:', payload);
}

module.exports = shopRedact;

