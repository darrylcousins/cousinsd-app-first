import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query getProducts($input: ProductSearchInput!) {
    getProducts(input: $input) {
      id
      title
      shopify_gid
      shopify_id
      available
      shopify_price
    }
  }
`;

export const TOGGLE_PRODUCT_AVAILABLE = gql`
  mutation toggleProductAvailable($input: ProductAvailableInput!) {
    toggleProductAvailable(input: $input) {
      id
    }
  }
`

/* SEE bak/queries.js */
