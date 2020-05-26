import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const HOST = 'https://4d7183b3.ngrok.io';

const typeDefs = gql`
  extend type Query {
    selectedBox: ID!
  }

  extend type Mutation {
    setSelectedBox(id: ID!): Int
  }
`;

const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`,
  typeDefs
});

export default LocalClient;
