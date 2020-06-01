const { gql } = require("apollo-server-koa");

const root = gql`
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

  type Query {
    getShop(input: ShopIdInput!): Shop
    getShops: [Shop]
    getBox(input: BoxIdInput!): Box
    getBoxes(input: BoxSearchInput!): [Box]
    getProduct(input: ProductIdInput!): Product
    getProducts(input: ProductSearchInput!): [Product]
  }

  type Mutation {
    createShop(input: ShopInput!): Shop
    updateShop(input: ShopInput!): Shop
    deleteShop(input: ShopIdInput!): Int
    createBox(input: BoxInput!): Box
    updateBox(input: BoxInput!): Box
    deleteBox(input: BoxIdInput!): Int
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductInput!): Product
    deleteProduct(input: ProductIdInput!): Int
  }
`;

module.exports = root;

