import { gql } from '@apollo/client';

export const GET_SELECTED_DATE = gql`
  query selectedDate {
    selectedDate @client
  }
`;
 
export const GET_BOX_DATES = gql`
  query getBoxDates {
    getBoxDates {
      delivered
      count
    }
  }
`;

export const FRAGMENT_PRODUCT_ARRAY = gql`
  fragment productArr on Box {
    products {
      id
      title
      available
      shopify_gid
      shopify_id
      shopify_variant_id
      shopify_price
    }
}`

export const FRAGMENT_ADDONS_ARRAY = gql`
  fragment addOnProductArr on Box {
    addOnProducts {
      id
      title
      available
      shopify_gid
      shopify_id
      shopify_variant_id
      shopify_price
    }
}`

export const GET_BOX = gql`
  query getBox($input: BoxIdInput!) {
    getBox(input: $input) {
      id
      delivered
      shopify_title
      shopify_handle
      shopify_gid
      shopify_id
      shopify_variant_id
      shopify_price
    }
  }
`;

export const GET_BOXES = gql`
  query getBoxes($input: BoxSearchInput!) {
    getBoxes(input: $input) {
      id
      delivered
      shopify_title
      shopify_gid
      shopify_id
      shopify_variant_id
      shopify_price
    }
  }
`;

/* returns box with products */
export const GET_BOX_PRODUCTS = gql`
  query getBoxProducts($input: BoxIdInput!) {
    getBoxProducts(input: $input) {
      ...productArr
      ...addOnProductArr
    }
  }
  ${FRAGMENT_PRODUCT_ARRAY}
  ${FRAGMENT_ADDONS_ARRAY}
`;

export const CREATE_BOX = gql`
  mutation createBox($input: BoxInput!) {
    createBox(input: $input) {
      id
      delivered
      shopify_title
      shopify_gid
      shopify_id
      shopify_handle
    }
  }
`

export const UPDATE_BOX = gql`
  mutation updateBox($input: BoxUpdateInput!) {
    updateBox(input: $input) {
      id
      shopify_title
    }
  }
`

export const DELETE_BOX = gql`
  mutation deleteBox($input: BoxIdInput!) {
    deleteBox(input: $input)
  }
`

export const BOX_ADD_PRODUCTS = gql`
  mutation addBoxProducts($input: BoxProductGidsInput!) {
    addBoxProducts(input: $input)
  }
`

export const BOX_REMOVE_PRODUCT = gql`
  mutation removeBoxProduct($input: BoxProductInput!) {
    removeBoxProduct(input: $input)
  }
`
/* SEE bak/queries.js */
