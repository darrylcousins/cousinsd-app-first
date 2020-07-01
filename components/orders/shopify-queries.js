import gql from 'graphql-tag';

// TODO this fails because a fulfillment service is required
export const FULFILL_LINE_ITEMS = gql`
  mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
    fulfillmentCreateV2(fulfillment: $fulfillment) {
      fulfillment {
        id
      }
      userErrors {
        field
        message
    }
  }
}
`;

export const GET_SHOPIFY_ORDERS= gql`
  query orders($first: Int!, $query: String) {
    orders(first: $first, query: $query) {
      edges {
        node {
          id
          name
          closed
          shippingAddress {
            name
            address1
            address2
            city
            province
            zip
          }
          lineItems(first: 5) {
            edges {
              node {
                id
                name
                product {
                  id
                  productType
                }
                quantity
                customAttributes {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

const mainQuery = `
  order@idx: order(id: "@id") {
    id
    name
    displayFinancialStatus
    displayFulfillmentStatus
    shippingAddress {
      name
      address1
      address2
      city
      province
      zip
    }
    lineItems(first: 10) {
      edges {
        node {
          id
          name
          fulfillmentStatus
          product {
            id
            productType
            handle
          }
          quantity
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
`;

export const getQuery = (ids) => {
  const gid = 'gid://shopify/Order/';
  const queries = ids.map((id, idx) => mainQuery
    .replace(`@idx`, idx)
    .replace(`@id`, `${gid}${id}`)
    .trim()
  )
  return gql`
    query fetchData {
      ${queries.join(`\n`)}
    }
  `;
};
/*
 * constructing query to get list of orders
 * Get a list of orders using their IDs and GraphQL aliases
{
  order1: order(id:"gid://shopify/Order/1248358563862") {
    name
  }
  order2: order(id:"gid://shopify/Order/1248358694934") {
    name
  }
}
*/
