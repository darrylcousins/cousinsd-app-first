import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
});

export const ShopifyHttpLink = new HttpLink({
  uri: `${HOST}/graphql`,
  fetch,
  fetchOptions: {
    credentials: 'include'
  },
});

export const ShopifyApolloClient = new ApolloClient({
  cache,
  link: ShopifyHttpLink,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('shopifyGraphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('shopifyNetworkError', JSON.stringify(networkError, null, 2))
  }
});

