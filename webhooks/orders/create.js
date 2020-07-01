const { Op } = require("sequelize");
const { Order } = require('../../models');

const orderCreate = (webhook, ShopId) => {
  const payload = webhook.payload;
  console.log('Received Create Order:', payload);

  const shopify_order_id = payload.id;
  const shopify_customer_id = payload.customer.id;

  // if line item quantity is 2 or more then will be picked up when printing labels
  payload.line_items.forEach(item => {
    var attrs = item.properties.reduce(
      (acc, curr) => Object.assign(acc, { [`${curr.name}`]: curr.value }),
      {});
    if (attrs['Delivery Date']) {
      var input = {
        shopify_order_id,
        shopify_customer_id,
        ShopId: parseInt(ShopId),
        delivered: attrs['Delivery Date'],
        shopify_product_id: item.product_id,
        shopify_line_item_id: item.id
      }
      console.log('Inserting', input);
      const order = Order.create(input)
        .then((value) => console.log('created order', value.shopify_order_id))
        .catch((error) => console.log('got error', error)
      );
    };
  });

};

module.exports = orderCreate;
