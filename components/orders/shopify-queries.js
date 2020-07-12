import { gql } from '@apollo/client';

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

export const GET_SHOPIFY_ORDER= gql`
  query order($id: ID!) {
    order(id: $id) {
      id
      name
    }
  }
`

/* full query to populate table data */
const mainQuery = `
  order@idx: order(id: "@id") {
    id
    name
    displayFinancialStatus
    displayFulfillmentStatus
    note
    customer {
      email
      phone
    }
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

/* export query to populate csv export data */
const exportQuery = `
  order@idx: order(id: "@id") {
    id
    name
    note
    customer {
      email
      phone
    }
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

/* just enough information to print picking list */
const shortQuery = `
  order@idx: order(id: "@id") {
    lineItems(first: 10) {
      edges {
        node {
          customAttributes {
            key
            value
          }
          product {
            productType
            handle
          }
          quantity
        }
      }
    }
  }
`;

const queryHelper = (ids, queryTemplate) => {
  const gid = 'gid://shopify/Order/';
  const queries = ids.map((id, idx) => queryTemplate
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

export const getMainQuery = (ids) => queryHelper(ids, mainQuery);
export const getShortQuery = (ids) => queryHelper(ids, shortQuery);
export const getExportQuery = (ids) => queryHelper(ids, exportQuery);
/*
 * constructing an order query
{
  order1: order(id:"gid://shopify/Order/1248358563862") {
    ...
  }
  ...
}
*/
