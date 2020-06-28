const createDocDefinition = ({ data, including, addons, removed }) => {
  const orders = data.data;
  const dd = {
    content: [{
      table: {
        widths: [250],
        body: [
        ]
      },
      layout: 'noBorders',
    }],
    styles: {
      bold: {
        bold: true,
      },
      productheader: {
        fontSize: 9,
        bold: true,
      },
      product: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  }
  const length = Object.keys(orders).length;
  let labels = Array();
  for (let i=0; i<length; i++) {
    var order = orders[`order${i}`];
    var address = order.shippingAddress;
    var products;
    const lineItems = order.lineItems.edges;
    const itemsLength = lineItems.length;
    const isNull = (el) => el === null ? '' : el;
    for (let i = 0; i < itemsLength; i++) {
      var stack = [];
      var column1 = [];
      var column2 = [];
      if (i%4 === 0) console.log('got to fourth?', i);
      if (lineItems[i].node.product.productType == 'Veggie Box') {
        var customAttributes = lineItems[i].node.customAttributes.reduce(
          (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
          {});
        stack.push(address.name);
        stack.push(`${address.address1} ${isNull(address.address2)}`);
        stack.push(`${address.city} ${address.zip}`);
        stack.push(`\nOrder ${order.name}`);

        column1.push({ style: 'productheader', text: `${including}` });
        products = customAttributes[including].split(',');
        column1.push({ style: 'product', text: products.join('\n') });

        column2.push({ style: 'productheader', text: `${addons}` });
        products = customAttributes[addons].split(',');
        column2.push({ style: 'product', text: products.join('\n') });

        column2.push({ style: 'productheader', text: `\n${removed}` });
        products = customAttributes[removed].split(',');
        column2.push({ style: 'product', text: products.join('\n') });

        dd.content[0].table.body.push([{ stack }]);
        dd.content[0].table.body.push(
          [{ 
            table: {
              widths: ['*', '*'],
              body: [[
                column1, column2
              ]]
            },
            layout: 'noBorders',
          }]
        );
        dd.content[0].table.body.push(['\n\n']);
      }
    }
  }
  //console.log(JSON.stringify(dd, null, 2));
  return new Promise((resolve, reject) => resolve(dd));
};

export default createDocDefinition;
