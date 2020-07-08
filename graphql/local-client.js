import { gql, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
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
  uri: `${HOST}/local_graphql`,
  fetch,
  fetchOptions: {
    credentials: 'include'
  },
});

export const LocalApolloClient = new ApolloClient({
  cache,
  fetch,
  resolvers,
  link: LocalHttpLink,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLError', JSON.stringify(graphQLErrors, null, 2))
    console.log('networkError', JSON.stringify(networkError, null, 2))
  }
});

const initState = (date) => {
  if (!date) date = new Date();
  //LocalApolloClient.cache.writeData({ data: { selectedDate: dateToISOString(date) }})
  LocalApolloClient.writeQuery({
    query: GET_SELECTED_DATE,
    data: {
      selectedDate: dateToISOString(date),
    }
  });
}
initState(new Date());

export const resetStore = (date) => {
  LocalApolloClient.resetStore().then(() => initState(date));
  initState(date);
}
LocalApolloClient.onResetStore(initState);



