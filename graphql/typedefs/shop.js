const { gql } = require("apollo-server-koa");

const shop = gql`
  type Shop {
    id: ID!
    name: String!
    email: String!
    url: String!
    shopify_name: String!
    shopify_id: Int!
    createdAt: String!
    updatedAt: String!
    boxes: [Box]
    products: [Product]
    subscribers: [Subscriber]
  }

  input ShopInput {
    id: ID
    name: String!
    email: String!
    url: String!
    shopify_name: String!
    shopify_id: Int!
  }

  input ShopIdInput{
    id: ID!
  }

  extend type Query {
    getShop(input: ShopIdInput!): Shop
    getShops: [Shop]
  }

  extend type Mutation {
    createShop(input: ShopInput!): Shop
    updateShop(input: ShopInput!): Shop
    deleteShop(input: ShopIdInput!): Int
  }
`;

module.exports = shop;
