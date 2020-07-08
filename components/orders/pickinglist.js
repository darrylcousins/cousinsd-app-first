
const createPickingDoc = ({ data, delivered }) => {

  const [delivery_date, including, addons, removed, subscription] = LABELKEYS;
  
  const dd = {
    content: []
  };
  const orders = data.data;
  const length = Object.keys(orders).length;
  let order;
  let lineItems;
  let attrs;
  let product;
  let products = {};
  for (let j=0; j<length; j++) {
    order = orders[`order${j}`];
    lineItems = order.lineItems.edges;
    for (let i = 0; i < lineItems.length; i++) {
      if (lineItems[i].node.product.productType == 'Veggie Box') {
        attrs = lineItems[i].node.customAttributes.reduce(
          (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
          {});
        attrs[including].split(',').forEach(key => {
          product = key.trim();
          if (Object.keys(products).indexOf(product) > -1) {
            products[product] = products[product] + 1;
          } else {
            products[product] = 1;
          }
        });
        attrs[addons].split(',').forEach(key => {
          product = key.trim();
          if (Object.keys(products).indexOf(product) > -1) {
            products[product] = products[product] + 1;
          } else {
            products[product] = 1;
          }
        });
      }
    }
  }
  let rows = []
  for (const [key, value] of Object.entries(products)) {
    rows.push([key, value.toString()]);
  }
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

