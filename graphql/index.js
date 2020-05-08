const { ApolloServer, gql } = require("apollo-server-koa");
const { Shop, Product, Box } = require('../models');

const typeDefs = gql`
  type Shop {
    id: ID!
    shopify_name: String!
    url: String!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    boxes: [Box]
  }

  type Box {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllShops: [Shop]
    getAllProducts: [Product]
    getAllBoxes: [Box]
  }

  input ShopInput {
    name: String
    shopify_name: String
    email: String
    url: String
  }

  type Mutation {
    createShop(input: ShopInput): Shop
  }
`;

const resolvers = {
  Query: {
    async getAllShops(root, args, { models }){
      return Shop.findAll();
    },
    async getAllBoxes(root, args, { models }){
      return Box.findAll();
    },
    async getAllProducts(root, args, { models }){
      return Product.findAll();
    },
  },
  Mutation: {
    async createShop (root, { input }, { models }) {
      const { name, shopify_name, email, url } = input;
      return Shop.create({
        name,
        shopify_name,
        email,
        url,
      })
    },
  },
  Shop: {
    async boxes(boxes) {
      return boxes.getBoxes()
    },
  },
};

const graphQLServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: true,
  bodyParser: true,
});

module.exports = {
  graphQLServer: graphQLServer,
}
