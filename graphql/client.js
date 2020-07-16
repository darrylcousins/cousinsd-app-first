import { gql, ApolloLink, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { RetryLink } from '@apollo/link-retry';
import fetch from 'isomorphic-fetch';
import { dateToISOString } from '../lib';
import { GET_SELECTED_DATE } from '../components/boxes/queries';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id,
});

const resolvers = {
  Mutation: {
    // selected box for collapsible on box list
    setSelectedBox: (_, args, { cache, getCacheKey }) => {
      const data = { selectedBox: args.id };
      cache.writeData({ data });
      return null;
    },
  },
};

export const LocalHttpLink = new HttpLink({
  uri: `/local_graphql`,
  fetch,
  fetchOptions: {
    credentials: 'include'
  },
});

export const ShopifyHttpLink = new HttpLink({
  uri: `/graphql`,
  fetch,
  fetchOptions: {
    credentials: 'include'
  },
});

const link = new RetryLink().split(
  (operation) => operation.getContext().shopify === true,
  ShopifyHttpLink,
  LocalHttpLink
);

export const Client = new ApolloClient({
  cache,
  fetch,
  resolvers,
  link,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});

const initState = (date) => {
  if (!date) date = new Date();
  Client.writeQuery({
    query: GET_SELECTED_DATE,
    data: {
      selectedDate: dateToISOString(date),
    }
  });
}
initState(new Date());

export const resetStore = (date) => {
  Client.resetStore().then(() => initState(date));
  initState(date);
}
Client.onResetStore(initState);

/* gets the current client without import 
import { useApolloClient } from '@apollo/client';
const client = useApolloClient();
*/

/*
 * This method requires adding context to every query
import { ApolloLink, HttpLink } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';

const link = new RetryLink().split(
    (operation) => operation.getContext().version === 1,
    new HttpLink({ uri: "http://localhost:4000/v1/graphql" }),
    new HttpLink({ uri: "http://localhost:4000/v2/graphql" })
);
 * compared to this method that creates a new directive to add to queries eg @shopify, @local
https://github.com/apollographql/apollo-client/issues/84#issuecomment-557400283
*/


