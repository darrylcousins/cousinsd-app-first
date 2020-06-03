import gql from 'graphql-tag';

export const GET_SHOP = gql`
  query getShop($input: ShopIdInput!) {
    getShop(input: $input) {
      url
    }
  }
`
