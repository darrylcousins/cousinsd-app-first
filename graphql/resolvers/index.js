const { merge } = require('lodash');
const ShopResolvers = require('./shop');
const BoxResolvers = require('./box');
const ProductResolvers = require('./product');
const BoxProductResolvers = require('./boxproduct');
const OrderResolvers = require('./order');
const SubscriptionResolvers = require('./subscription');
const SubscriberResolvers = require('./subscriber');
const BigInt = require('graphql-bigint');
const GraphQLJSON = require('graphql-type-json');
const { GraphQLJSONObject } = require('graphql-type-json');
const GraphQLUUID = require('graphql-type-uuid');

const resolvers = merge(
  { UUID: GraphQLUUID },
  { JSON: GraphQLJSON, JSONObject: GraphQLJSONObject },
  { BigInt },
  ShopResolvers,
  ProductResolvers,
  BoxResolvers,
  BoxProductResolvers,
  OrderResolvers,
  SubscriptionResolvers,
  SubscriberResolvers,
);

module.exports = resolvers;
