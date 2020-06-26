import gql from 'graphql-tag';

export const GET_ORDERS= gql`
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
