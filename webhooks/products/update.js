const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productUpdate = (webhook) => {
  const payload = webhook.payload;
  console.log('Received Product:', payload);

  const shopId = payload.vendor == 'Spring Collective' ? 1 : null;

  if (shopId) {
    const input = {
      name: payload.title,
      storeProductId: payload.admin_graphql_api_id,
      available: true,
      handle: payload.handle,
      shopId,
    };

    console.log(input);
    const product = Product.update(input)
      .then((value) => console.log('updated product', value.name))
      .catch((error) => console.log('got error', error)
    );
  } else {
    console.log('Failed to update product with payload', payload);
  }
}

module.exports = productUpdate;

