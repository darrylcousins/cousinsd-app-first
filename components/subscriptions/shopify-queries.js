import { gql } from '@apollo/client';

export const GET_SUBSCRIBED_CUSTOMERS= gql`
  query customers($first: Int!, $query: String!) {
    customers(first: $first, query: $query) {
      edges {
        node {
          email
          displayName
        }
      }
    }
  }
`

