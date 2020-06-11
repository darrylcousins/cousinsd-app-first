const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productUpdate = (webhook, ShopId) => {
  const payload = webhook.payload;
  console.log('Received Product:', payload.title, payload.product_type);

  if (payload.product_type === 'Box Produce') {
    const input = {
      title: payload.title,
      shopify_id: parseInt(payload.id),
      shopify_gid: payload.admin_graphql_api_id,
      shopify_handle: payload.handle,
      //available: true,
      ShopId,
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
  if (payload.product_type === 'Veggie Box') {
    const input = {
      shopify_title: payload.title,
      shopify_id: parseInt(payload.id),
      shopify_gid: payload.admin_graphql_api_id,
      shopify_handle: payload.handle,
      ShopId,
    };

    console.log(input);
    // get by shopify_id
    const product = Box.update(
      input,
      { where: { shopify_id: payload.id } }
    ).then((value) => console.log('updated box', value))
      .catch((error) => console.log('got error', error)
    );
  };
};

module.exports = productUpdate;

