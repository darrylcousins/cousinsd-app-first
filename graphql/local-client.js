import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { dateToISOString } from '../lib';

const HOST = 'https://b75aca9bdbd8.ngrok.io';

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

