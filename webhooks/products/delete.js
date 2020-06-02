const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productDelete = (webhook) => {
  const payload = webhook.payload; // the product.shopify_id
  console.log('Received Product:', payload);
  const product = Product.destroy(
    { where: { shopify_id: parseInt(payload.id) } }
  ).then((value) => console.log('deleted product', value))
    .catch((error) => console.log('got error', error)
  );
};

module.exports = productDelete;

