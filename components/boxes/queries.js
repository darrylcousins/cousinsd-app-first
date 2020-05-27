import gql from 'graphql-tag';

export const SET_SELECTED_BOX = gql`
  mutation setSelectedBox($id: Int!) {
    setSelectedBox(id: $id) @client
  }
`;

export const GET_SELECTED_BOX = gql`
  query selectedBox {
    selectedBox @client
  }
`;

export const SET_SELECTED_DATE = gql`
  mutation setSelectedDate($delivered: String!) {
    setSelectedDate(delivered: $delivered) @client
  }
`;

export const GET_SELECTED_DATE = gql`
  query selectedDate {
    selectedDate @client
  }
`;

export const GET_BOXES = gql`
  query getBoxes($shopId: Int!, $delivered: String!) {
    getBoxes(shopId: $shopId, delivered: $delivered) {
      id
      name
      delivered
      products {
        id
        name
        available
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

export const CREATE_BOX = gql`
  mutation createBox($input: BoxInput!) {
    createBox(input: $input) {
      id
      name
      delivered
    }
  }
`

export const DELETE_BOX = gql`
  mutation deleteBox($input: BoxDeleteInput!) {
    deleteBox(input: $input)
  }
`
