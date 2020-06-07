const { gql } = require("apollo-server-koa");

const box = gql`
  type Box {
    id: ID!
    title: String!
    delivered: String!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_title: String!
    shopify_handle: String!
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
    shopify_handle: String!
  }

  input BoxUpdateInput {
    id: ID!
    title: String
    delivered: String
    shopId: ID
    shopify_id: BigInt
    shopify_gid: String
    shopify_title: String
    shopify_handle: String
  }

  input BoxSearchInput {
    shopId: ID!
    delivered: String
  }

  input BoxIdInput {
    id: ID!
  }

  input BoxShopifyIdInput {
    shopify_id: BigInt!
    shopId: Int!
  }

  extend type Query {
    getBox(input: BoxIdInput!): Box
    getBoxes(input: BoxSearchInput!): [Box]
    getBoxProducts(input: BoxIdInput!): Box
    getBoxesByShopifyId(input: BoxShopifyIdInput!): [Box]
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxUpdateInput!): Box
    deleteBox(input: BoxIdInput!): Int
  }
`;

module.exports = box;

