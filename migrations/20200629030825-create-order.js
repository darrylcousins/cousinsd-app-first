'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      delivered: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      shopify_order_id: {
        type: Sequelize.BIGINT,
      },
      shopify_product_id: {
        type: Sequelize.BIGINT,
      },
      shopify_line_item_id: {
        type: Sequelize.BIGINT,
      },
      shopify_customer_id: {
        type: Sequelize.BIGINT,
      },
      ShopId: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Orders');
  }
};
