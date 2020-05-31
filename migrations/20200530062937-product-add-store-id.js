'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Products', // name of Source model
      'alt_name', // name of the column we are adding
    ).then(() => {
      return queryInterface.addColumn(
        'Products', // name of Source model
        'handle', // name of the column we are adding
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
    }).then(() => {
      return queryInterface.addColumn(
        'Products', // name of Source model
        'storeProductId', // name of the column we are adding
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Products', // name of Source model
      'handle', // name of the constraint we're removing 
    ).then(() => {
      return queryInterface.removeColumn(
        'Products', // name of Source model
        'storeProductId', // name of the column we are removing
      );
    }).then(() => {
      return queryInterface.addColumn(
        'Products', // name of Source model
        'alt_name', // name of the column we are adding
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
    });
  }
};
