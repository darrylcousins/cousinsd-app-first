const { gql } = require("apollo-server-koa");

const subscriber = gql`
  type Subscriber {
    id: ID!
    uid: UUID!
    shopify_customer_id: BigInt!
    ShopId: Int!
    createdAt: String!
    updatedAt: String!
    subscriptions: [Subscription]
  }

  input SubscriberInput {
    id: ID
    uid: UUID!
    shopify_customer_id: BigInt!
    ShopID: Int!
  }

  input SubscriberUUIDInput{
    uid: UUID!
  }

  input SubscriberSearchInput {
    ShopId: ID!
  }

  extend type Query {
    getSubscriber(input: SubscriberUUIDInput!): Subscriber
    getSubscribers(input: SubscriberSearchInput): [Subscriber]
  }

  extend type Mutation {
    createSubscriber(input: SubscriberInput!): Subscriber
    updateSubscriber(input: SubscriberInput!): Subscriber
    deleteSubscriber(input: SubscriberUUIDInput!): UUID
  }
`;

module.exports = subscriber;

