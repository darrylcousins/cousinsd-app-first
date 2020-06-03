import ApolloClient from 'apollo-boost';

export const ShopifyApolloClient = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});


