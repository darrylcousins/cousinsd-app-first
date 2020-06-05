const { gql } = require("apollo-server-koa");

const box = gql`
  type Box {
    id: ID!
    title: String!
    delivered: String!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_title: String!
    shopId: Int!
    createdAt: String!
    updatedAt: String!
    products: [Product]
    addOnProducts: [Product]
    shop: Shop
  }

  input BoxInput {
    title: String!
    delivered: String
    shopId: ID!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_title: String!
  }

  input BoxUpdateInput {
    id: ID!
    title: String
    delivered: String
    shopId: ID
    shopify_id: BigInt
    shopify_gid: String
    shopify_title: String
  }

  input BoxSearchInput {
    shopId: ID!
    delivered: String
  }

  input BoxIdInput {
    id: ID!
  }

  input BoxShopifyIdInput {
    shopify_id: BigInt
  }

  extend type Query {
    getBox(input: BoxIdInput!): Box
    getBoxes(input: BoxSearchInput!): [Box]
    getBoxProducts(input: BoxIdInput!): Box
    getBoxByShopifyId(input: BoxShopifyIdInput!): Box
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxUpdateInput!): Box
    deleteBox(input: BoxIdInput!): Int
  }
`;

module.exports = box;

