import { gql } from '@apollo/client';

export const GET_SUBSCRIBERS = gql`
  query getSubscribers ($input: SubscriberSearchInput) {
    getSubscribers (input: $input) {
      id
      ShopId
      shopify_customer_id
      subscriptions {
        frequency
        shopify_product_id
      }
    }
  }
`;

export const GET_SUBSCRIPTIONS = gql`
  query getSubscriptions ($input: SubscriptionSearchInput!) {
    getSubscriptions (input: $input) {
      SubscriberId
      subscriber {
        shopify_customer_id
      }
      frequency
      last_cart
      current_cart
    }
  }
`;
