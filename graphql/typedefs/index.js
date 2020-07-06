const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const shop = require('./shop');
const product = require('./product');
const box = require('./box');
const boxproduct = require('./boxproduct');
const order = require('./order');

const root = gql`
  scalar BigInt

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [root, shop, product, box, boxproduct, order];

module.exports = typeDefs;
