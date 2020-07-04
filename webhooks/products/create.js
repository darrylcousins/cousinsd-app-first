const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');

const productCreate = (webhook, ShopId) => {
  const payload = webhook.payload;
  console.log('Received Create Product:', payload.title, payload.product_type);

  if (payload.product_type === 'Box Produce') {
    const input = {
      title: payload.title,
      shopify_id: parseInt(payload.id),
      shopify_gid: payload.admin_graphql_api_id,
      shopify_handle: payload.handle,
      shopify_variant_id: payload.variants[0].id,
      shopify_price: parseInt(parseFloat(payload.variants[0].price) * 100),
      available: true,
      ShopId: parseInt(ShopId),
    };

    console.log(input);
    const product = Product.create(input)
      .then((value) => console.log('created product', value.title))
      .catch((error) => console.log('got error', error)
    );
  }
};

module.exports = productCreate;
