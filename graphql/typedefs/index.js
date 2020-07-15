const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const shop = require('./shop');
const product = require('./product');
const box = require('./box');
const boxproduct = require('./boxproduct');
const order = require('./order');
const subscription = require('./subscription');
const subscriber = require('./subscriber');

const root = gql`
  scalar BigInt
  scalar JSON
  scalar JSONObject
  scalar UUID

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [root, shop, product, box, boxproduct, order, subscription, subscriber];

module.exports = typeDefs;
