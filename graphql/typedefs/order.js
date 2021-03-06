const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const order = gql`
  type Order {
    id: ID!
    delivered: String!
    shopify_name: String!
    shopify_order_id: BigInt!
    shopify_product_id: BigInt!
    shopify_line_item_id: BigInt!
    shopify_customer_id: BigInt!
    ShopId: Int!
    shop: Shop
    createdAt: String!
    updatedAt: String!
  }

  type OrderDate {
    delivered: String!
    count: Int!
  }

  type OrdersCountAndRows {
    rows: [Order]
    count: Int
  }

  input OrderSearchInput {
    ShopId: ID!
    delivered: String!
    offset: Int!
    limit: Int!
    shopify_product_id: BigInt
    shopify_name: String
  }

  input OrderDuplicateInput {
    ShopId: ID!
    delivered: String!
    shopify_product_id: BigInt!
    shopify_customer_id: BigInt!
  }

  input OrderShopIdInput {
    ShopId: ID!
  }

  input OrderIdInput {
    id: ID!
  }

  input OrderShopifyUpdateInput {
    shopify_order_id: BigInt!
    shopify_name: String!
  }

  extend type Query {
    getOrderDates: [OrderDate]
    getOrder(input: OrderIdInput!): Order
    getOrders(input: OrderSearchInput!): OrdersCountAndRows
    getAllOrders(input: OrderShopIdInput!): [Order]
    checkOrderDuplicate(input: OrderDuplicateInput!): Order
  }

  extend type Mutation {
    updateOrderName(input: OrderShopifyUpdateInput!): Order
  }
`;

module.exports = order;
