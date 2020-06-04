const { merge } = require('lodash');
const ShopResolvers = require('./shop');
const BoxResolvers = require('./box');
const ProductResolvers = require('./product');
const BoxProductResolvers = require('./boxproduct');
const BigInt = require('graphql-bigint');

const resolvers = merge(
  { BigInt },
  ShopResolvers,
  ProductResolvers,
  BoxResolvers,
  BoxProductResolvers,
);

module.exports = resolvers;
