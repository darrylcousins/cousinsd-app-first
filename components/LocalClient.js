import ApolloClient from 'apollo-boost';

const LocalClient = new ApolloClient({
  uri: "https://68331e1c.ngrok.io/local_graphql"
});

export default LocalClient;
