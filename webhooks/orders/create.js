const { Op } = require("sequelize");
const { Box, Order, Subscription, Subscriber } = require('../../models');
const LABELKEYS = [
  'Delivery Date', 
  'Including', 
  'Add on items', 
  'Removed items', 
  'Subscription',
  'Add on product to'
];
const fs = require('fs');

/* helpers */
const toHandle = (title) => title.replace(' ', '-').toLowerCase();

const listToArray = (arr) => {
  return arr.split(',')
    .map(el => el.trim())
    .filter(el => el != '')
    .map(el => toHandle(el));
};

const arrayAdd = (arr, value) => {
  if (!arr.includes(value)) arr.push(value);
  return arr;
};

const getTotalPrice = (items) => {
  let price = 0;
  items.forEach((el) => {
    price += el.quantity * el.price;
  });
  return price;
};

const getQuantities = (items, addons) => {
  let quantities = [];
  items.forEach((el) => {
    if (addons.indexOf(el.handle) > -1) {
      quantities.push({
        handle: el.handle,
        quantity: el.quantity,
        variant_id: el.shopify_variant_id
      });
    }
  });
  return quantities;
};

const savePayload = (payload) => {
  fs.appendFile('order.json', JSON.stringify(payload, null, 2), function (err) {
    if (err) console.log('Error saving json to file');
    console.log('Saved!');
  });
};


const orderCreate = (webhook, ShopId) => {
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
      const cart = {
        box_id: box.id,
        delivered,
        including: listToArray(boxItem.including),
        addons: addOnProducts,
        dislikes: listToArray(boxItem.dislikes),
        shopify_title: box_title,
        shopify_id: boxItem.shopify_product_id,
        subscription: boxItem.subscription,
        total_price: getTotalPrice(productItems.concat([boxItem])),
        quantities: getQuantities(productItems, addOnProducts),
        is_loaded: true,
      };
      const order_input = {
        shopify_name: shopify_order_name,
        shopify_order_id,
        shopify_customer_id,
        ShopId,
        delivered,
        shopify_product_id: boxItem.shopify_product_id,
        shopify_line_item_id: boxItem.line_item_id,
        is_subscription: boxItem.subscription !== null,
      };
      console.log('Inserting order with', order_input);
      /*
      Order.create(order_input)
        .then((value) => console.log('created order', value.id))
        .catch((error) => console.log('got error', error)
      );
      */
      console.log('Subscribed', boxItem.subscription);
      if (boxItem.subscription !== null) {
        const subscriber_input = {
          ShopId,
          shopify_customer_id,
        };
        console.log('Inserting subscriber with', subscriber_input);
        const subscriber = Subscriber.findOrCreate({ where: subscriber_input })
          .then(([instance, created]) => {
            console.log('created subscriber', instance, created);
            const subscription_input = {
              shopify_product_id: boxItem.shopify_product_id,
              SubscriberId: instance.id,
            };
            console.log('Inserting subscription with', subscription_input);
            // doing this allows for change to happen to cart and subscription
            Subscription.findOrCreate({ where: subscription_input })
              .then(([instance, created]) => {
                const subscription_update = {
                  id: instance.id,
                  shopify_product_id: instance.shopify_product_id,
                  SubscriberId: instance.SubscriberId,
                  frequency: boxItem.subscription,
                  current_cart: cart,
                  last_cart: cart,
                };
                Subscription.upsert(subscription_update, { where: { id: instance.id }})
                 .then(([instance, updated]) => console.log('updated subscription', instance.id))
                 .catch(err => console.log('error updating subscription'));
                console.log('created subscription', instance.id);
              })
              .catch((error) => console.log('got error', error)
            );
          })
          .catch((error) => console.log('got error', error)
        );
      };
    })
    .catch(err => console.log(err))
    .finally(res => console.log('Finished'));
  };
}

module.exports = orderCreate;
