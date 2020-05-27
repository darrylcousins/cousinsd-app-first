import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const HOST = 'https://4d7183b3.ngrok.io';

const resolvers = {
  Mutation: {
    // selected box for collapsible on box list
    setSelectedBox: (_, args, { cache, getCacheKey }) => {
      const data = { selectedBox: args.id };
      cache.writeData({ data });
      return null;
    },
    // deliver date for box list query
    setSelectedDate: (_, args, { cache, getCacheKey }) => {
      const data = { selectedDate: args.delivered };
      cache.writeData({ data });
      return null;
    },
  },
};

const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`,
  resolvers
});

export default LocalClient;
