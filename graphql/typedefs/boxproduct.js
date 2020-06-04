const { gql } = require("apollo-server-koa");

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
  }

  input BoxProductGidsInput {
    boxId: ID!
    productGids: [String!]!
  }

  extend type Mutation {
    addBoxProducts(input: BoxProductGidsInput!): Boolean
    removeBoxProduct(input: BoxProductInput!): Boolean
  }
`;

module.exports = boxproduct;


