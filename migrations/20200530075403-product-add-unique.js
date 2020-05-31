'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Products', // name of Source model
      ['storeProductId', 'handle', 'shopId'],
      {
        type: 'unique',
        name: 'productgid_unique',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Products', // name of Source model
      'productgid_unique', // name of the constraint we're removing 
    );
  }
};
