import ApolloClient from 'apollo-boost';

const HOST = 'https://4d7183b3.ngrok.io';

const LocalClient = new ApolloClient({
  uri: `${HOST}/local_graphql`
});

export default LocalClient;
