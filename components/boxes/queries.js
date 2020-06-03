import gql from 'graphql-tag';

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
      handle
      shopify_gid
      shopify_id
    }
}`

export const GET_BOXES = gql`
  query getBoxes($input: BoxSearchInput!) {
    getBoxes(input: $input) {
      id
      title
      delivered
      handle
      shopify_title
      shopify_gid
      shopify_id
      ...productArray
    }
  }${FRAGMENT_PRODUCT_ARRAY}
`;

export const CREATE_BOX = gql`
  mutation createBox($input: BoxInput!) {
    createBox(input: $input) {
      id
      title
      delivered
      handle
      shopify_title
      shopify_gid
      shopify_id
      shopify_id
      ...productArray
    }
  }${FRAGMENT_PRODUCT_ARRAY}
`

export const UPDATE_BOX = gql`
  mutation updateBox($input: BoxUpdateInput!) {
    updateBox(input: $input) {
      id
      title
      handle
    }
  }
`

export const DELETE_BOX = gql`
  mutation deleteBox($input: BoxIdInput!) {
    deleteBox(input: $input)
  }
`
/* SEE bak/queries.js */
