const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productDelete = (webhook) => {
  const payload = webhook.payload;
  console.log('Received Product:', payload);
}

module.exports = productDelete;

