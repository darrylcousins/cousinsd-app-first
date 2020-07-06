import { gql, ApolloClient, createHttpLink } from '@apollo/client';
import fetch from 'isomorphic-fetch';
import { dateToISOString } from '../lib';

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

export const LocalApolloClient = new ApolloClient({
  uri: `${HOST}/local_graphql`,
  fetch: fetch,
  resolvers,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});

export const LocalHttpLink = createHttpLink({
  uri: `${HOST}/local_graphql`,
  fetch: fetch,
  fetchOptions: {
    credentials: 'include'
  },
});

const initState = (date) => {
  if (!date) date = new Date();
  LocalApolloClient.writeData({ data: { selectedDate: dateToISOString(date) }})
}
initState(new Date());

export const resetStore = (date) => {
  LocalApolloClient.resetStore().then(() => initState(date));
  initState(date);
}
LocalApolloClient.onResetStore(initState);

