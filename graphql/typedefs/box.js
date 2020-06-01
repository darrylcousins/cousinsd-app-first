const { gql } = require("apollo-server-koa");

const box = gql`
  type Box {
    id: ID!
    handle: String!
    delivered: String!
    shopify_id: Int!
    shopify_gid: String!
    shopId: Int!
    createdAt: String!
    updatedAt: String!
    products: [Product]
    shop: Shop
  }

  type BoxProduct {
    boxId: ID!
    productId: ID!
  }

  input BoxInput {
    id: ID
    handle: String!
    delivered: String
    shopId: ID!
    shopify_id: Int!
    shopify_gid: String!
  }

  input BoxSearchInput {
    shopId: ID!
    delivered: String
  }

  input BoxIdInput {
    id: ID!
  }

  extend type Query {
    getBox(input: BoxIdInput!): Box
    getBoxes(input: BoxSearchInput!): [Box]
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxInput!): Box
    deleteBox(input: BoxIdInput!): Int
  }
`;

module.exports = box;

