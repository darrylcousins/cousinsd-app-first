const { gql } = require('@apollo/client');

const boxproduct = gql`
  type BoxProduct {
    id: ID!
    boxId: ID!
    productId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input BoxProductInput {
    boxId: ID!
    productId: ID!
    isAddOn: Boolean!
  }

  input BoxProductGidsInput {
    boxId: ID!
    productGids: [String!]!
    isAddOn: Boolean!
  }

  extend type Mutation {
    addBoxProducts(input: BoxProductGidsInput!): Boolean
    removeBoxProduct(input: BoxProductInput!): Boolean
  }
`;

module.exports = boxproduct;


