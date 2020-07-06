import gql from '@apollo/client';

export const GET_ORDERS = gql`
  query getOrders($input: OrderSearchInput!) {
    getOrders(input: $input) {
      id
      delivered
      shopify_order_id
      shopify_line_item_id
      shopify_product_id
      shopify_customer_id
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query getAllOrders($input: ShopIdInput!) {
    getAllOrders(input: $input) {
      shopify_order_id
    }
  }
`;

export const GET_ORDER_DATES = gql`
  query getOrderDates {
    getOrderDates {
      delivered
      count
    }
  }
`;

