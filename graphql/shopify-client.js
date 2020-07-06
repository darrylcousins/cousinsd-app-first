import { ApolloClient, createHttpLink } from '@apollo/client';
import fetch from 'isomorphic-fetch';

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
