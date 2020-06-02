import gql from 'graphql-tag';

export const GET_SHOPIFY_PRODUCT = gql`
  query product($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;

export const FRAGMENT_BOX_NAME = gql`
  fragment boxName on Box {
    title
  }
`;

export const FRAGMENT_BOX_PRODUCTGID = gql`
  fragment boxProductGid on Box {
    shopify_gid
  }
`;

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
 
export const FRAGMENT_PRODUCT_ARRAY = gql`
  fragment productArray on Box {
    products {
      id
      title
      available
    }
}`

export const GET_BOXES = gql`
  query getBoxes($input: BoxSearchInput!) {
    getBoxes(input: $input) {
      id
      title
      delivered
      shopify_gid
      ...productArray
    }
  }${FRAGMENT_PRODUCT_ARRAY}
`;

export const BOX_UPDATE_DELIVERED = gql`
  mutation boxUpdateDelivered($input: BoxDeliveredInput!) {
    boxUpdateDelivered(input: $input) {
      id
      title
      shopify_gid
      delivered
    }
  }
`

export const BOX_UPDATE_NAME = gql`
  mutation boxUpdateName($input: BoxLooseInput!) {
    boxUpdateName(input: $input) {
      id
      title
    }
  }
`

export const BOX_UPDATE_PRODUCTGID = gql`
  mutation boxUpdateProductGid($input: BoxProductGidInput!) {
    boxUpdateProductGid(input: $input) {
      id
      shopify_gid
    }
  }
`

export const DUPLICATE_BOX = gql`
  mutation duplicateBox($input: BoxDuplicateInput!) {
    duplicateBox(input: $input) {
      id
      title
      delivered
      shopify_gid
      ...productArray
    }
  }${FRAGMENT_PRODUCT_ARRAY}
`

export const CREATE_BOX = gql`
  mutation createBox($input: BoxInput!) {
    createBox(input: $input) {
      title
      handle
    }
  }
`

export const DELETE_BOX = gql`
  mutation deleteBox($input: BoxDeleteInput!) {
    deleteBox(input: $input)
  }
`
