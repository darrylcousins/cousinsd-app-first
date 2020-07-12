'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      frequency: {
        type: Sequelize.ENUM,
        values: ['Weekly', 'Fortnightly', 'Monthly'],
      },
      current_cart: {
        type: Sequelize.JSONB,
      },
      last_cart: {
        type: Sequelize.JSONB,
      },
      SubscriberId: {
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
    return queryInterface.dropTable('Subscriptions');
  }
};


