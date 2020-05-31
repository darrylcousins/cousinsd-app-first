'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Boxes', // name of Source model
      'storeProductId', // name of the column we are adding
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Boxes', // name of Source model
      'storeProductId', // name of the column we are removing
    );
  }
};
