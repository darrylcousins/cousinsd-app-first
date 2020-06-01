const { merge } = require('lodash');
const ShopResolvers = require('./shop');
const BoxResolvers = require('./box');
const ProductResolvers = require('./product');

const resolvers = merge(
  {},
  ShopResolvers,
  ProductResolvers,
  BoxResolvers,
);

module.exports = resolvers;
