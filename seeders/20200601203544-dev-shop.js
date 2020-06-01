'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shops', [{
      name: 'Dev Shop',
      email: 'darryljcousins@gmail.com',
      url: 'https://cousinsd-app-test.myshopify.com',
      shopify_name: 'cousinsd-app-test',
      shopify_id: 123456789,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shops', null, {});
  }
};
