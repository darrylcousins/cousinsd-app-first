import { dateToISOString } from '../../lib';

const createLabelDoc = ({ data, delivered }) => {

  const [delivery_date, including, addons, removed, subscription] = LABELKEYS;
  
  const orders = data.data;
  const dd = {
    content: [{
      columns: []
    }
    ],
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
  var leftColumn = [];
  var rightColumn = [];
  var bothColumns = [leftColumn, rightColumn];
  var table = {
    table: {
      widths: [250],
      body: [
      ]
    },
    layout: 'noBorders',
  }
  data.forEach(el => {
    const orders = el.data;
    if (el.errors) {
      console.log('ERRORS', el.errors);
      return;
    }
    const length = Object.keys(orders).length;
    let counter = 0;
    for (let j=0; j<length; j++) {
      var order = orders[`order${j}`];
      var address = order.shippingAddress;
      var customer = order.customer;
      var products;
      const lineItems = order.lineItems.edges;
      const itemsLength = lineItems.length;
      const isNull = (el) => el === null ? '' : el;
      for (let i = 0; i < itemsLength; i++) {
        var stack = [];
        var column1 = [];
        var column2 = [];
        /* Every second table goes into right column */
        /* make list of paid for products to draw upon */
        var produce = Array();
        for (let j = 0; j < lineItems.length; j++) {
          let node = lineItems[i].node;

          // XXX TODO check for correct date for box association (hint: uses customAttributes)
          if (node.product.productType == 'Box Produce') {
            produce.push(node.product.handle);
          }
        }
        if (lineItems[i].node.product.productType == 'Veggie Box') {
          var customAttributes = lineItems[i].node.customAttributes.reduce(
            (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
            {});
          const deliveryDate = dateToISOString(new Date(customAttributes[delivery_date]));
          if (deliveryDate == dateToISOString(new Date(delivered))) {
            const lineItem = lineItems[i].node;
            stack.push(address.name);
            stack.push(`${address.address1}`)
            if (address.address2) stack.push(`${isNull(address.address2)}`);
            stack.push(`${address.city} ${address.zip}`);
            if (customer.phone) stack.push(`${isNull(customer.phone)}`);
            stack.push(`\n${new Date(delivered).toDateString()} ${order.name}`);
            stack.push(`${lineItem.name}`)

            column1.push({ style: 'productheader', text: `${including}` });
            products = customAttributes[including].split(',').map(el => el.trim()).filter(el => el !== '');
            column1.push({ style: 'product', text: products.join('\n') });

            column2.push({ style: 'productheader', text: `${addons}` });
            products = customAttributes[addons].split(',').map(el => el.trim()).filter(el => el !== '');

            products = products.filter(el => {
              const handle = el.replace(' ', '-').toLowerCase();
              return (produce.indexOf(handle) > -1);
            });

            column2.push({ style: 'product', text: products.join('\n') });

            column2.push({ style: 'productheader', text: `\n${removed}` });
            products = customAttributes[removed].split(',').map(el => el.trim()).filter(el => el !== '');
            column2.push({ style: 'product', text: products.join('\n') });

            table.table.body.push([{ stack }]);
            table.table.body.push(
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
            table.table.body.push(['\n\n']);
            bothColumns[counter%2].push(table);
            table = {
              table: {
                widths: [250],
                body: [
                ]
              },
              layout: 'noBorders',
            }
            counter++;
          }
        }
      }
    }
  });
  if (leftColumn.length) dd.content[0].columns.push(leftColumn);
  if (rightColumn.length) dd.content[0].columns.push(rightColumn);
  //console.log(JSON.stringify(dd, null, 2));
  return new Promise((resolve, reject) => resolve(dd));
};

export default createLabelDoc;
