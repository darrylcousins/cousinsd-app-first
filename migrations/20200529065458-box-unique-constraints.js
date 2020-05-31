'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Boxes', // name of Source model
      ['storeProductId', 'delivered', 'shopId'],
      {
        type: 'unique',
        name: 'box_productgid_unique',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Boxes', // name of Source model
      'box_productgid_unique', // name of the constraint we're removing 
    );
  }
};
