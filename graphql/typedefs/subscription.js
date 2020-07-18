const { gql } = require("apollo-server-koa");


const subscription = gql`
  type Subscription {
    id: ID!
    uid: UUID!
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
    uid: UUID!
    frequency: String!
    current_cart: JSON!
    last_cart: JSON!
    shopify_product_id: BigInt!
    SubscriberId: Int!
  }

  input SubscriptionUpdateInput {
    uid: UUID!
    current_cart: JSON!
    frequency: String!
    last_cart: JSON
    shopify_product_id: BigInt
  }

  input SubscriptionUUIDInput{
    uid: UUID!
  }

  input SubscriptionSearchInput {
    SubscriberUUID: UUID!
  }

  extend type Query {
    getSubscription(input: SubscriptionUUIDInput!): Subscription
    getSubscriptions(input: SubscriptionSearchInput!): [Subscription]
  }

  extend type Mutation {
    createSubscription(input: SubscriptionInput!): Subscription
    updateSubscription(input: SubscriptionUpdateInput!): Subscription
    deleteSubscription(input: SubscriptionUUIDInput!): UUID
  }
`;

module.exports = subscription;


