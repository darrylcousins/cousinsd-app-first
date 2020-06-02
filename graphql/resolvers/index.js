const { merge } = require('lodash');
const ShopResolvers = require('./shop');
const BoxResolvers = require('./box');
const ProductResolvers = require('./product');
const BigInt = require('graphql-bigint');

const resolvers = merge(
  { BigInt },
  ShopResolvers,
  ProductResolvers,
  BoxResolvers,
);

module.exports = resolvers;
