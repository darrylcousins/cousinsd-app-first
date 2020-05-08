import ApolloClient from 'apollo-boost';

const HOST = 'https://184cf61b.ngrok.io';

const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`
});

export default LocalClient;
