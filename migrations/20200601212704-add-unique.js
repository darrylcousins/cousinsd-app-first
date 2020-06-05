'use strict';
module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Boxes', // name of Source model
      ['delivered', 'shopify_id', 'shopId'],
      {
        type: 'unique',
        name: 'box_unique',
      }
    ).then(() => {
      return queryInterface.addConstraint(
        'BoxProducts', // name of Source model
        ['BoxId', 'ProductId', 'isAddOn'],
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
        'BoxProducts', // name of Source model
        'boxproduct_unique', // name of the constraint we're removing 
      );
    });
  },
};

