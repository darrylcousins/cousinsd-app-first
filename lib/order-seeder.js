import fetch from 'isomorphic-fetch';
import { gql, execute } from '@apollo/client';
import { LocalHttpLink } from '../graphql/local-client';
import { ShopifyHttpLink } from '../graphql/shopify-client';
import { GET_ALL_ORDERS } from '../components/orders/queries';
import { GET_SHOPIFY_ORDER } from '../components/orders/shopify-queries';
import { makePromise } from './index';

const GET_CURRENT_BOXES = gql`
  query getCurrentBoxes($input: BoxSearchInput!) {
    getCurrentBoxes(input: $input) {
      shopify_title
      shopify_variant_id
      shopify_id
      shopify_price
      delivered
      products {
        shopify_variant_id
        shopify_price
        title
      }
      addOnProducts {
        shopify_variant_id
        shopify_price
        title
      }
    }
  }
`;

const CHECK_ORDER_DUPLICATE = gql`
  query checkOrderDuplicate($input: OrderDuplicateInput!) {
    checkOrderDuplicate(input: $input) {
      id
    }
  }
`;

export const UPDATE_ORDER_NAME = gql`
  mutation updateOrderName($input: OrderShopifyUpdateInput!) {
    updateOrderName(input: $input) {
      shopify_name
    }
  }
`
const getFetch = async ({ url }) => {
  const res = await fetch(url, {
    credentials: 'include',
  })
  return await res.json();
};

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

function* shuffle(array) {
  var i = array.length;
  while (i--) {
    yield array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
  }
}

export const fixNames = () => {
  // get orders ids
  const variables = { input: { ShopId: SHOP_ID }};
  console.log(variables);
  execute(LocalHttpLink, { query: GET_ALL_ORDERS, variables })
    .subscribe({
      next: (res) => {
        const gid = 'gid://shopify/Order/';
        const orderids = res.data.getAllOrders.map(el => `${gid}${el.shopify_order_id}`);

        if (orderids.length > 0) {
          console.log('order full count', orderids.length);

          const task = (i) => {
            setTimeout(() => {
              console.log('throttling with timeout');

              const id = orderids[i];
              makePromise(execute(ShopifyHttpLink, { query: GET_SHOPIFY_ORDER, variables: { id } }))
                .then(res => {
                  console.log('shopify return', res);
                  const shopify_name = res.data.order.name;
                  const shopify_order_id = parseInt(res.data.order.id.split('/')[4]);
                  const input = {
                    shopify_name,
                    shopify_order_id
                  };
                  console.log(input);
                  makePromise(execute(LocalHttpLink, { query: UPDATE_ORDER_NAME, variables: { input } }))
                    .then(res => {
                      console.log(res.data.updateOrderName.shopify_name);
                      return res;
                    })
                    .catch(err => console.log('error updating order name', err));
                      return res;
                    })
                .catch(err => console.log('error getting shopify order', err));

            }, 1000 * i);
          };
          //for (let i=0; i<5; i++) {
          for (let i=0; i<orderids.length; i++) {
            task(i);
          }
 
        } else {
          console.log('got no orders');
        }
      },
      error: (err) => console.log('get orders error', err),
    });

  // for each order id

  // -- get from shopify

  // -- update local with shopify_name - using model.Shop directly if it works
}

const orderWithCustomer = (order, customer) => {
  order.user_id = customer.id;
  order.email = customer.email;
  let address = customer.addresses[0];
  order.shipping_address = {
    first_name: address.first_name,
    address1: address.address1,
    phone: address.phone,
    city: address.city,
    zip: address.zip,
    province: address.province,
    country: address.country,
    last_name: address.last_name,
    address2: address.address2,
    company: address.company,
    name: address.name,
    country_code: address.country_code,
    province_code: address.province_code,
  }
  return order;
}

const orderWithBox = (order, box, customer) => {
  const [delivery_date, including, addons, removed, subscription, addOnTo] = LABELKEYS;
  const boxDelivered = new Date(parseInt(box.delivered)).toString().slice(0, 15);

  order.line_items = [];

  let total_price = 0;
  total_price += box.shopify_price;

  // do add products
  let addOnArray = [];
  let removedArray = [];
  let includingArray = box.products.map(el => el.title);

  // make randomised list of keys
  const productKeys = [...shuffle(Object.keys(box.products))];
  const addOnProductKeys = [...shuffle(Object.keys(box.addOnProducts))];

  // input for check duplicates but async programming got me buggered
  const input = {
    delivered: box.delivered,
    shopify_customer_id: customer.id,
    shopify_product_id: box.shopify_id,
    ShopId: SHOP_ID,
  };

  // make a random number of products as addson
  const addOnCount = getRandomInt(4);

  for (var i=0; i<addOnCount; i++) {
    let product = box.addOnProducts[addOnProductKeys[i]];
    addOnArray.push(product.title);
    total_price += product.shopify_price;
    order.line_items.push({
      quantity: 1,
      variant_id: parseInt(product.shopify_variant_id),
      properties: [
        {
          name: addOnTo,
          value: `${box.shopify_title} delivered on ${boxDelivered}`
        },
        {
          name: 'Title',
          value: product.title
        },
      ]
    });
  }

  // make one or none product as removed
  const removedCount = getRandomInt(5);
  if (removedCount > 0) {
    let product = box.products[productKeys[0]];
    removedArray.push(product.title);
    includingArray = includingArray.filter(el => el !== product.title);
  }

  // finally add on the box itself
  order.line_items.push({
    quantity: 1,
    variant_id: parseInt(box.shopify_variant_id),
    properties: [
      {
        name: delivery_date,
        value: boxDelivered
      },
      {
        name: including,
        value: includingArray.join(', ')
      },
      {
        name: addons,
        value: addOnArray.join(', ')
      },
      {
        name: removed,
        value: removedArray.join(', ')
      }
    ],
  });
  order.total_price = parseFloat(total_price * .01).toFixed(2).toString();
  return order;
}

const queryBoxes = new Promise((resolve, reject) => {
  // get boxes later than today
  const variables = {
    input: {
      delivered: new Date(),
      ShopId: SHOP_ID,
    }
  }
  execute(LocalHttpLink, { query: GET_CURRENT_BOXES, variables })
    .subscribe({
      next: (res) => {
        resolve(res.data.getCurrentBoxes);
      },
      error: (err) => console.log('get boxes error', err),
      //complete: () => console.log('execute orders complete'),
    });
});

// unused
const checkOrderDuplicate = async ({ delivered, shopify_customer_id, shopify_product_id }) => {
  const checkPromise = new Promise((resolve, reject) => {
    const variables = {
      input: {
        delivered,
        shopify_customer_id,
        shopify_product_id,
        ShopId: SHOP_ID,
      }
    }
    execute(LocalHttpLink, { query: CHECK_ORDER_DUPLICATE, variables })
      .subscribe({
        next: (res) => {
          resolve(res.data.checkOrderDuplicate);
        },
        error: (err) => console.log('get duplicate error', err),
        //complete: () => console.log('execute orders complete'),
      });
  });
  const result = await checkPromise
    .then(res => {
      return res;
    });
  return result;
}


export const OrderSeeder = async () => {
  // first collect some customers for email, user_id and shipping_address
  const url = `${HOST}/api/customers`;
  const { customers } = await getFetch({ url });
  console.log(customers.length);
  let orders = [];
  const count = customers.length;
  queryBoxes
    .then(boxes => {
      for (var i=70; i<count; i++) {
        let order = {
          gateway: "bogus",
          test: true,
        };
        let customer = customers[i];
        order = orderWithCustomer(order, customer);
        let boxKeys = shuffle(Object.keys(boxes));
        order = orderWithBox(order, boxes[boxKeys.next().value], customer);
        orders.push(order);
      };
    });
  return orders;
};
