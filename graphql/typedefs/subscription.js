const { gql } = require("apollo-server-koa");


const subscription = gql`
  type Subscription {
    id: ID!
    frequency: String!
    current_cart: JSON!
    last_cart: JSON!
    shopify_product_id: BigInt!
    SubscriberId: Int!
    subscriber: Subscriber
    createdAt: String!
    updatedAt: String!
  }

  input SubscriptionInput {
    id: ID
    frequency: String!
    current_cart: JSON!
    last_cart: JSON!
    shopify_product_id: BigInt!
    SubscriberId: Int!
  }

  input SubscriptionIdInput{
    id: ID!
  }

  input SubscriptionSearchInput {
    SubscriberId: ID!
  }

  extend type Query {
    getSubscription(input: SubscriptionIdInput!): Subscription
    getSubscriptions(input: SubscriptionSearchInput!): [Subscription]
  }

  extend type Mutation {
    createSubscription(input: SubscriptionInput!): Subscription
    updateSubscription(input: SubscriptionInput!): Subscriber
    deleteSubscription(input: SubscriptionIdInput!): Int
  }
`;

module.exports = subscription;


