import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
  query customer($id: ID!) {
    customer(id: $id) {
      email
      displayName
    }
  }
`

export const GET_PRODUCT= gql`
  query product($id: ID!) {
    product(id: $id) {
      title
    }
  }
`
