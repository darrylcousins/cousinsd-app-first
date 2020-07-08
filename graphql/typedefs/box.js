const { gql } = require('@apollo/client');

const box = gql`
  type Box {
    id: ID!
    title: String!
    delivered: String!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    ShopId: Int!
    createdAt: String!
    updatedAt: String!
    products: [Product]
    addOnProducts: [Product]
    shop: Shop
  }

  type BoxDate {
    delivered: String
    count: Int
  }

  input BoxInput {
    title: String!
    delivered: String
    ShopId: ID!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input BoxUpdateInput {
    id: ID!
    title: String
    delivered: String
    ShopId: ID
    shopify_id: BigInt
    shopify_gid: String
    shopify_title: String
    shopify_handle: String
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input BoxSearchInput {
    ShopId: ID!
    delivered: String
  }

  input BoxIdInput {
    id: ID!
  }

  input BoxShopifyIdInput {
    shopify_id: BigInt!
    ShopId: Int!
  }

  extend type Query {
    getBoxDates: [BoxDate]
    getBox(input: BoxIdInput!): Box
    getBoxes(input: BoxSearchInput!): [Box]
    getCurrentBoxes(input: BoxSearchInput!): [Box]
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

