import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

export const ShopifyApolloClient = new ApolloClient({
  uri: `${HOST}/graphql`,
  fetch: fetch,
  fetchOptions: {
    credentials: 'include'
  },
  onError: ({ networkError, graphQLErrors }) => {
    console.log('shopifyGraphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('shopifyNetworkError', JSON.stringify(networkError, null, 2))
  }
});

export const ShopifyHttpLink = createHttpLink({
  uri: `${HOST}/graphql`,
  fetch: fetch,
  fetchOptions: {
    credentials: 'include'
  },
});
