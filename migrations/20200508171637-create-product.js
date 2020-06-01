'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      handle: {
        type: Sequelize.STRING,
        unique: true,
      },
      shopify_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      shopify_gid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};
