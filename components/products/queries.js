import gql from 'graphql-tag';

export const FRAGMENT_PRODUCT_AVAILABLE = gql`
  fragment productAvailable on Product {
    available
  }
`;

export const FRAGMENT_PRODUCT_NAME = gql`
  fragment productName on Product {
    title
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts($input: ProductSearchInput!) {
    getProducts(input: $input) {
      title
      shopify_gid
      available
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct($input: ProductCreateInput!) {
    createProduct(input: $input) {
      id
      title
      available
    }
  }
`

export const BOX_ADD_PRODUCT = gql`
  mutation boxAddCreateProduct($input: BoxCreateProductInput!) {
    boxAddCreateProduct(input: $input) {
      id
      title
      available
    }
  }
`

export const BOX_GET_DESELECTED_PRODUCTS = gql`
  query boxGetDeselectedProducts($boxId: Int!) {
    boxGetDeselectedProducts(boxId: $boxId) {
      id
      title
      available
    }
  }
`;

export const TOGGLE_PRODUCT_AVAILABLE = gql`
  mutation toggleProductAvailable($input: ProductSimpleInput!) {
    toggleProductAvailable(input: $input) {
      id
    }
  }
`

export const PRODUCT_UPDATE_NAME = gql`
  mutation productUpdateName($input: ProductLooseInput!) {
    productUpdateName(input: $input) {
      id
      title
      available
    }
  }
`

export const BOX_REMOVE_PRODUCT = gql`
  mutation boxRemoveProduct($input: BoxProductInput!) {
    boxRemoveProduct(input: $input) {
      id
    }
  }
`

export const PRODUCT_ADD_BOX = gql`
  mutation productAddBox($input: BoxProductInput!) {
    productAddBox(input: $input) {
      id
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($input: ProductDeleteInput!) {
    deleteProduct(input: $input)
  }
`
