import { dateToISOString } from '../../lib';

const createCsvRows = ({ data, delivered }) => {

  const [delivery_date, including, addons, removed, subscription] = LABELKEYS;
  
  let rows = []

  data.forEach(el => {
    const orders = el.data;
    if (el.errors) {
      console.log('ERRORS', el.errors);
      return;
    }

    const length = Object.keys(orders).length;
    let counter = 0;
    for (let j=0; j<length; j++) {
      let order = orders[`order${j}`];

      let address = order.shippingAddress;
      var customer = order.customer;

      let orderName = order.name; // the order number
      let boxName; // the box title
      let addressArray = [];
      let includedItems = [];
      let removedItems = [];
      let addonItems = [];
      let deliveryDate;

      
      const lineItems = order.lineItems.edges;
      const itemsLength = lineItems.length;
      const isNull = (el) => el === null ? '' : el;

      for (let i = 0; i < itemsLength; i++) {
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
          deliveryDate = dateToISOString(new Date(customAttributes[delivery_date]));
          if (deliveryDate == dateToISOString(new Date(Date.parse(delivered)))) {
            const lineItem = lineItems[i].node;
            boxName = lineItem.name;
            addressArray.push(address.name);
            addressArray.push(`${address.address1}`)
            if (address.address2) addressArray.push(`${isNull(address.address2)}`);
            addressArray.push(`${address.city} ${address.zip}`);
            if (customer.email) addressArray.push(`${isNull(customer.email)}`);
            if (customer.phone) addressArray.push(`${isNull(customer.phone)}`);

            includedItems = customAttributes[including].split(',').map(el => el.trim()).filter(el => el !== '');
            addonItems = customAttributes[addons].split(',').map(el => el.trim()).filter(el => el !== '');

            addonItems = addonItems.filter(el => {
              const handle = el.replace(' ', '-').toLowerCase();
              return (produce.indexOf(handle) > -1);
            });

            removedItems = customAttributes[removed].split(',').map(el => el.trim()).filter(el => el !== '');

          }
        }
      }
      rows.push([
        addressArray.join('\n'),
        boxName,
        deliveryDate,
        orderName,
        includedItems.join('\n'),
        removedItems.join('\n'),
        addonItems.join('\n'),
      ]);
    }
  });
  const headers = [
    'Address',
    'Box',
    'Delivered',
    'Order',
    'Including',
    'Dislikes',
    'Addons'
  ];

  return { headers, rows };
};

export default createCsvRows;
