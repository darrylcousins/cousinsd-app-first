'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Boxes', // name of Source model
      'shopId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
        model: 'Shops', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      }
    ).then(() => {
      return queryInterface.addColumn(
          'Products', // name of Source model
          'shopId', // name of the key we're adding 
          {
            type: Sequelize.INTEGER,
            references: {
            model: 'Shops', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'Boxes', // name of Source model
        'shopId' // key we want to remove
    ).then(() => {
      return queryInterface.removeColumn(
          'Products', // name of Source model
          'shopId' // key we want to remove
        );
      });
    }
};
