const { gql } = require("apollo-server-koa");

const product = gql`
  type Product {
    id: ID!
    title: String!
    available: Boolean!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    createdAt: String!
    updatedAt: String!
    ShopId: Int!
    boxes: [Box]
    shop: Shop
  }

  input ProductInput {
    title: String!
    available: Boolean
    ShopId: ID!
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input ProductUpdateInput {
    id: ID!
    title: String
    available: Boolean
    ShopId: ID
    shopify_id: BigInt
    shopify_gid: String
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input ProductIdInput{
    id: ID!
  }

  input ProductSearchInput {
    ShopId: ID!
  }

  input ProductAvailableInput {
    id: ID!
    available: Boolean!
  }

  extend type Query {
    getProduct(input: ProductIdInput!): Product
    getProducts(input: ProductSearchInput!): [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductUpdateInput!): Product
    deleteProduct(input: ProductIdInput!): Int
    toggleProductAvailable(input: ProductAvailableInput!): Product
  }
`;

module.exports = product;

