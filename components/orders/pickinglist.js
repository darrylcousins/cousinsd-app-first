import { keySort } from '../../lib';

const createPickingDoc = ({ data, delivered }) => {

  const [delivery_date, including, addons, removed, subscription] = LABELKEYS;

  let errors;
  
  const dd = {
    content: []
  };

  let products = {};
  let productQuantities = {};
  data.forEach(el => {
    const orders = el.data;
    if (el.errors) {
      console.log('ERRORS', el.errors);
      return;
    }
    const length = Object.keys(orders).length;
    let order;
    let lineItems;
    let lineItem;
    let attrs;
    let product;
    for (let j=0; j<length; j++) {
      order = orders[`order${j}`];
      lineItems = order.lineItems.edges;
      for (let i = 0; i < lineItems.length; i++) {
        lineItem = lineItems[i].node;

        // XXX TODO check for correct date for box association (hint: uses customAttributes)
        if (lineItem.product.productType == 'Box Produce') {
          if (lineItem.quantity > 1) {
            if (Object.keys(productQuantities).indexOf(lineItem.product.handle) > -1) {
              productQuantities[lineItem.product.handle] = productQuantities[lineItem.product.handle] + lineItem.quantity - 1;
            } else {
              productQuantities[lineItem.product.handle] = lineItem.quantity - 1;
            }
            console.log('produce quantity counter', lineItem.product.handle, lineItem.quantity);
          }
        }
        if (lineItem.product.productType == 'Veggie Box') {
          attrs = lineItem.customAttributes.reduce(
            (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
            {});
          attrs[including].split(',').forEach(key => {
            product = key.trim();
            if (product.length > 0) {
              product = product.replace(' ', '-').toLowerCase();
              if (Object.keys(products).indexOf(product) > -1) {
                products[product] = products[product] + 1;
              } else {
                products[product] = 1;
              }
            }
          });
          attrs[addons].split(',').forEach(key => {
            product = key.trim();
            if (product.length > 0) {
              product = product.replace(' ', '-').toLowerCase();
              if (Object.keys(products).indexOf(product) > -1) {
                products[product] = products[product] + 1;
              } else {
                products[product] = 1;
              }
            }
          });
        }
      }
    }
  });
  let rows = []
  for (const [key, value] of Object.entries(products)) {
    if (Object.keys(productQuantities).indexOf(key) > -1) {
      value += productQuantities[key];
    };
    rows.push([key, value.toString()]);
  }
  rows.sort(keySort);
  const table = {
      table: {
        body: rows
      },
      layout: 'noBorders',
  };
  dd.content.push(table);
  return new Promise((resolve, reject) => resolve(dd));
};

export default createPickingDoc;

