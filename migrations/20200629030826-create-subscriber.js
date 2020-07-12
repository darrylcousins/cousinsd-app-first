'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscribers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shopify_customer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: { isInt: true },
        unique: 'compositeIndex',
      },
      ShopId: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Subscribers');
  }
};

