const { gql } = require("apollo-server-koa");

const product = gql`
  type Product {
    id: ID!
    name: String!
    handle: String!
    available: Boolean!
    shopify_id: Int!
    shopify_gid: String!
    createdAt: String!
    updatedAt: String!
    shopId: Int!
    boxes: [Box]
    shop: Product
  }

  input ProductInput {
    id: ID
    name: String!
    handle: String!
    available: Boolean
    shopId: ID!
    shopify_id: Int!
    shopify_gid: String!
  }

  input ProductIdInput{
    id: ID!
  }

  input ProductSearchInput {
    shopId: ID!
  }

  extend type Query {
    getProduct(input: ProductIdInput!): Product
    getProducts(input: ProductSearchInput!): [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductInput!): Product
    deleteProduct(input: ProductIdInput!): Int
  }
`;

module.exports = product;

