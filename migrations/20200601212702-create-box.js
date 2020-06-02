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
      handle: {
        type: Sequelize.STRING,
        unique: true,
      },
      delivered: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      shopify_title: {
        type: Sequelize.STRING,
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
      shopId: {
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
