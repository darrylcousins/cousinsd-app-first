'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      shopify_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
      },
      shopify_gid: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
      },
      shopify_handle: {
        type: Sequelize.STRING,
        unique: true,
      },
      shopify_variant_id: {
        type: Sequelize.BIGINT,
      },
      shopify_price: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Products');
  }
};
