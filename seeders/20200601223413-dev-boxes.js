'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Boxes', [{
      handle: 'small-box',
      shopify_id: 123456789,
      shopify_gid: 'gid://123456789',
      shopId: 1,
      delivered: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Boxes', null, {});
  }
};
