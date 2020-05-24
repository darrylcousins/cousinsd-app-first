import gql from 'graphql-tag';

export const GET_BOXES = gql`
  query getBoxes($shopId: Int!) {
    getBoxes(shopId: $shopId) {
      id
      name
      delivered
      products {
        id
        name
      }
    }
  }
`;

export const BOX_UPDATE_DELIVERED = gql`
  mutation boxUpdateDelivered($input: BoxDeliveredInput!) {
    boxUpdateDelivered(input: $input) {
      id
      name
      delivered
    }
  }
`
