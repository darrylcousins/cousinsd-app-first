'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Boxes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      delivered: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      shopify_handle: {
        type: Sequelize.STRING,
      },
      shopify_title: {
        type: Sequelize.STRING,
      },
      shopify_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      shopify_gid: {
        type: Sequelize.STRING,
        primaryKey: true,
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
    return queryInterface.dropTable('Boxes');
  }
};
