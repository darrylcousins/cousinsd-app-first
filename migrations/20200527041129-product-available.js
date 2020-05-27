'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Products', // name of Source model
      'available', // name of the column we are removing
    ).then(() => {
      return queryInterface.addColumn(
        'Products', // name of Source model
        'available', // name of the column we are adding
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 1,
        },
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Products', // name of Source model
      'available', // name of the column we are removing
    ).then(() => {
      return queryInterface.addColumn(
        'Products', // name of Source model
        'available', // name of the column we are adding
        {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      );
    });
  }
};
