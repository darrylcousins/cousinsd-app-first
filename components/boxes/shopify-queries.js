import gql from 'graphql-tag';

export const GET_PRODUCT_TITLE= gql`
  query product($id: ID!) {
    product(id: $id) {
      title
    }
  }
`
