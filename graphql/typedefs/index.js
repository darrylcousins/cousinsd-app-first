const { gql } = require("apollo-server-koa");
const { makeExecutableSchema } = require('graphql-tools');

const shop = require('./shop');
const product = require('./product');
const box = require('./box');

const root = gql`
  scalar BigInt

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [root, shop, product, box];

module.exports = typeDefs;
