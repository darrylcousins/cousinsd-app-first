const { Op } = require("sequelize");
const { Order } = require('../../models');

const orderDelete = (webhook, ShopId) => {
  const payload = webhook.payload;
  console.log('Received Delete Order:', payload);
  console.log('TODO delete order with id:', payload.id);

  const order = Order.destroy(
    { where: { shopify_order_id: parseInt(payload.id) } }
  ).then((value) => console.log('deleted order', value))
    .catch((error) => console.log('got error', error)
  );
};

module.exports = orderDelete;
