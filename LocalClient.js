import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { dateToISOString } from './lib';

const HOST = 'https://d1dc35b33bca.ngrok.io';

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

export const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`,
  resolvers
});

const initState = (date) => {
  if (!date) date = new Date();
  LocalClient.writeData({ data: { selectedDate: dateToISOString(date) }})
}
initState(new Date());

export const resetStore = (date) => {
  LocalClient.resetStore().then(() => initState(date));
  initState(date);
}
LocalClient.onResetStore(initState);
