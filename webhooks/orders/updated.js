const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const orderUpdated = (webhook, ShopId) => {
  const payload = webhook.payload;
  console.log('Received Update Order:', payload);
};

module.exports = orderUpdated;
