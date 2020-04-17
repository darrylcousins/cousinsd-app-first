const Query = require('./selected_products.query');
const SelectedProductsMap = require('./selected_products.map');
const Mutation = require('./selected_products.mutation');

const resolver = {
  Query: Query,
  SelectedProducts: SelectedProductsMap,
};

module.exports = { resolver };
