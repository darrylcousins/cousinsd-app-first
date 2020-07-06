import gql from '@apollo/client';

export const GET_PRODUCT_TITLE= gql`
  query product($id: ID!) {
    product(id: $id) {
      title
    }
  }
`
