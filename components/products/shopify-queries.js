import { gql } from '@apollo/client';

export const PRODUCT_UPDATE= gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const GET_PRODUCT_PRICE= gql`
  query product($id: ID!) {
    product(id: $id) {
      title
      totalVariants
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`
