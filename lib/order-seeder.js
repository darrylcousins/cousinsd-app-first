import fetch from 'node-fetch';

const getFetch = ({ url }) => {
  return fetch(url, {
    credentials: 'include',
  })
};

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

export const SeedOrders = ({count}) => {
  // first collect some customers for email, user_id and shipping_address
  const url = `${HOST}/api/customers`;
  getFetch({ url })
    .then(res => res.json())
    .then(json => {
      const customers = json.customers;
      console.log(customers);
      const random = getRandomInt(customers.length);
      var customer = customers[random];
      var order = {};
      order.user_id = customer.id;
      order.email = customer.email;
      var address = customer.addresses[0];
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
      console.log(order);
    })
    .catch(err => console.log(err));
  return 'finished';
};
