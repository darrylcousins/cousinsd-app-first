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
    delivered: String
    count: Int
  }

  input OrderSearchInput {
    ShopId: ID!
    delivered: String
  }

  input OrderIdInput {
    id: ID!
  }

  extend type Query {
    getOrderDates: [OrderDate]
    getOrder(input: OrderIdInput!): Order
    getOrders(input: OrderSearchInput!): [Order]
    getAllOrders(input: ShopIdInput!): [Order]
  }
`;

module.exports = order;

