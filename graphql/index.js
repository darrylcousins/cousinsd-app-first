const { ApolloServer } = require("apollo-server-koa");
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const graphQLServer = new ApolloServer({
  schema: schema,
  playground: true,
  bodyParser: true,
  debug: true,
});

module.exports = {
  graphQLServer: graphQLServer,
}
