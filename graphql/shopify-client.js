import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
});

export const ShopifyApolloClient = new ApolloClient({
  fetch,
  cache,
  uri: `${HOST}/graphql`,
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
