const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productCreate = (webhook, shopId) => {
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
  const product = Product.create(input)
    .then((value) => console.log('created product', value.name))
    .catch((error) => console.log('got error', error)
  );
};

module.exports = productCreate;
