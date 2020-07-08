const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const order = gql`
  type Order {
    id: ID!
    delivered: String!
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

  input OrderSearchInput {
    ShopId: ID!
    delivered: String!
    offset: Int!
    limit: Int!
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

  extend type Query {
    getOrderDates: [OrderDate]
    getOrder(input: OrderIdInput!): Order
    getOrders(input: OrderSearchInput!): [Order]
    getAllOrders(input: OrderShopIdInput!): [Order]
    checkOrderDuplicate(input: OrderDuplicateInput!): Order
  }
`;

module.exports = order;
