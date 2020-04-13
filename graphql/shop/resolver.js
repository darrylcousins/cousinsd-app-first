const { Query } = require('./shop.query');
const { ShopMap } = require('./shop.map');
const { Mutation } = require('./shop.mutation');

const resolver = {
  Query: Query,
  Shop: ShopMap,
};

module.exports = { resolver };
