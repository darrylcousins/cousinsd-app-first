const fs = require('fs');

const LABELKEYS = [
  'Delivery Date', 
  'Including', 
  'Add on items', 
  'Removed items', 
  'Subscription',
  'Add on product to'
];

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

module.exports = {
  LABELKEYS, toHandle, listToArray, arrayAdd, getTotalPrice, getQuantities
};

