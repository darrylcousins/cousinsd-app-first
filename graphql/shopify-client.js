import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

const HOST = 'https://b75aca9bdbd8.ngrok.io';

export const ShopifyApolloClient = new ApolloClient({
  uri: `${HOST}/graphql`,
  fetch: fetch,
  fetchOptions: {
    credentials: 'include'
  },
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});


