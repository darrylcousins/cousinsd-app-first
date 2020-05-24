import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query getProducts($shopId: Int!) {
    getProducts(shopId: $shopId) {
      id
      name
      available
    }
  }
`;

export const BOX_ADD_PRODUCT = gql`
  mutation boxAddCreateProduct($input: BoxCreateProductInput!) {
    boxAddCreateProduct(input: $input) {
      id
      name
    }
  }
`
export const BOX_GET_DESELECTED_PRODUCTS = gql`
  query boxGetDeselectedProducts($boxId: Int!) {
    boxGetDeselectedProducts(boxId: $boxId) {
      id
      name
    }
  }
`;

