const { gql } = require("apollo-server-koa");

const shop = require('./shop');
const product = require('./product');
const box = require('./box');

const root = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [root, shop, product, box];

module.exports = typeDefs;
