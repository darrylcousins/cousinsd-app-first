import ApolloClient from 'apollo-boost';

const HOST = 'https://68075f2b.ngrok.io';

const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`
});

export default LocalClient;
