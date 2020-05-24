'use strict';

//down: queryInterface => queryInterface.removeConstraint('TableName', 'indexname')
module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Boxes', // name of Source model
      ['name', 'delivered', 'shopId'], // name of the key we're adding 
      {
        type: 'unique',
        name: 'box_unique',
      }
    ).then(() => {
      return queryInterface.addConstraint(
        'Products', // name of Source model
        ['name', 'shopId'], // name of the key we're adding 
        {
          type: 'unique',
          name: 'product_unique',
        }
      );
    }).then(() => {
      return queryInterface.addConstraint(
        'BoxProduct', // name of Source model
        ['boxId', 'productId'], // name of the key we're adding 
        {
          type: 'unique',
          name: 'boxproduct_unique',
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Boxes', // name of Source model
      'box_unique', // name of the constraint we're removing 
    ).then(() => {
      return queryInterface.removeConstraint(
        'Products', // name of Source model
        'product_unique', // name of the constraint we're removing 
      );
    }).then(() => {
      return queryInterface.removeConstraint(
        'BoxProduct', // name of Source model
        'boxproduct_unique', // name of the constraint we're removing 
      );
    });
  }
};
