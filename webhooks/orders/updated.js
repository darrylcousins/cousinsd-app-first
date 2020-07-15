const { Box, Order, Subscription, Subscriber } = require('../../models');
const { LABELKEYS, toHandle, listToArray, arrayAdd, getTotalPrice, getQuantities } = require('./lib');

const orderUpdated = (webhook, ShopId) => {
  const [delivery_date, p_in, p_add, p_dislikes, subscribed, addprod] = LABELKEYS;

  const payload = webhook.payload;
  //console.log('Received Create Order:', JSON.stringify(payload, null, 2));
  let box_map = new Map();
  let produce_map = new Map();

  // if line item quantity is 2 or more then will be picked up when printing labels
  payload.line_items.forEach(item => {
    var attrs = item.properties.reduce(
      (acc, curr) => Object.assign(acc, { [`${curr.name}`]: curr.value }),
      {});
    if (delivery_date in attrs && p_in in attrs && p_add in attrs) {
      // we have a veggie box
      const subscription = subscribed in attrs ? attrs[subscribed] : null;
      const delivery = attrs[delivery_date];

      let key = `${delivery}::${item.title}`;
      box_map.set(key, {
        subscription,
        quantity: item.quantity,
        shopify_product_id: item.product_id,
        shopify_variant_id: item.variant_id,
        line_item_id: item.id,
        price: parseInt(parseFloat(item.price) * 100),
        including: attrs[p_in],
        addons: attrs[p_add],
        dislikes: attrs[p_dislikes],
      });
    };
    if (delivery_date in attrs && addprod in attrs) {
      // we have an add in product
      const delivered = attrs[delivery_date];
      let key = `${delivered}::${attrs[addprod]}`;

      const tempProduct = {
        box_product_name: attrs[addprod],
        handle: toHandle(item.title),
        shopify_variant_id: item.variant_id,
        shopify_product_id: item.product_id,
        price: parseInt(parseFloat(item.price) * 100),
        quantity: item.quantity,
      };
      if (produce_map.has(key)) {
        produce_map.set(key, [tempProduct].concat(produce_map.get(key)));
      } else {
        produce_map.set(key, [tempProduct]);
      }
    };
  });

  const shopify_order_id = payload.id;
  const shopify_order_name = payload.name;
  const shopify_customer_id = payload.customer.id;
  const total_price = parseInt(parseFloat(payload.total_price) * 100);

  for (let key of box_map.keys()) {
    let [delivered, box_title] = key.split('::');
    let boxItem = box_map.get(key);
    let productItems = produce_map.get(key);

    Box.findOne(
      { where: {
        shopify_id: boxItem.shopify_product_id,
        shopify_variant_id: boxItem.shopify_variant_id,
        delivered: new Date(Date.parse(delivered)),
      }}
    )
    .then(box => {
      let addOnProducts = listToArray(boxItem.addons);
      let addOnRemoveQty = addOnProducts.map(el => {
        const idx = el.indexOf(' '); // should be safe because these are spaceless handles
        if (idx > -1 ) return el.slice(0, idx);
        return el;
      });
      const order_input = {
        shopify_name: shopify_order_name,
        shopify_customer_id,
        ShopId,
        delivered,
        shopify_product_id: boxItem.shopify_product_id,
        shopify_line_item_id: boxItem.line_item_id,
        is_subscription: boxItem.subscription !== null,
      };
      console.log('Updating order with', order_input);
      Order.update(
        order_input,
        { where: { shopify_order_id: payload.id } }
      ).then((value) => console.log('updated order', value))
        .catch((error) => console.log('got error', error)
      );
    })
    .catch(err => console.log(err))
    .finally(res => console.log('Finished'));
  };
}

module.exports = orderUpdated;
