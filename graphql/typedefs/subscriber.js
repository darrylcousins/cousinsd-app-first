const { gql } = require("apollo-server-koa");

const subscriber = gql`
  type Subscriber {
    id: ID!
    shopify_customer_id: BigInt!
    ShopId: Int!
    createdAt: String!
    updatedAt: String!
    subscriptions: [Subscription]
  }

  input SubscriberInput {
    id: ID
    shopify_customer_id: BigInt!
    ShopID: Int!
  }

  input SubscriberIdInput{
    id: ID!
  }

  input SubscriberSearchInput {
    ShopId: ID!
  }

  extend type Query {
    getSubscriber(input: SubscriberIdInput!): Subscriber
    getSubscribers(input: SubscriberSearchInput): [Subscriber]
  }

  extend type Mutation {
    createSubscriber(input: SubscriberInput!): Subscriber
    updateSubscriber(input: SubscriberInput!): Subscriber
    deleteSubscriber(input: SubscriberIdInput!): Int
  }
`;

module.exports = subscriber;

