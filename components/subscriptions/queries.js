import { gql } from '@apollo/client';

export const GET_SUBSCRIBERS = gql`
  query getSubscribers ($input: SubscriberSearchInput) {
    getSubscribers (input: $input) {
      uid
      ShopId
      shopify_customer_id
      subscriptions {
        uid
        frequency
        shopify_product_id
      }
    }
  }
`;

export const GET_SUBSCRIPTION = gql`
  query getSubscription ($input: SubscriptionUUIDInput!) {
    getSubscription (input: $input) {
      uid
      SubscriberId
      subscriber {
        uid
        shopify_customer_id
      }
      frequency
      last_cart
      current_cart
    }
  }
`;
