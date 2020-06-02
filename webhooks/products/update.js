const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productUpdate = (webhook, shopId) => {
  const payload = webhook.payload;
  console.log('Received Product:', payload.title);

  const input = {
    title: payload.title,
    shopify_id: parseInt(payload.id),
    shopify_gid: payload.admin_graphql_api_id,
    available: true,
    handle: payload.handle,
    shopId,
  };

  console.log(input);
  // get by shopify_id
  const product = Product.update(
    input,
    { where: { shopify_id: payload.id } }
  ).then((value) => console.log('updated product', value))
    .catch((error) => console.log('got error', error)
  );
};

module.exports = productUpdate;

