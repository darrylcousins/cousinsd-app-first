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
      delivered: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      shopId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    return queryInterface.dropTable('Boxes');
  }
};
