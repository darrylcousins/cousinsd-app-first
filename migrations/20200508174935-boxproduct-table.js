'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'BoxProduct',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        boxId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          //onUpdate: 'CASCADE',
          //onDelete: 'SET NULL',
        },
        productId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          //onUpdate: 'CASCADE',
          //onDelete: 'SET NULL',
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BoxProduct');
  },
};
