const { ApolloServer, gql, UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box, BoxProduct } = require('../models');

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
    products: [Product]
  }

  type Box {
    id: ID!
    name: String!
    delivered: String!
    createdAt: String!
    updatedAt: String!
    shopId: Int!
    products: [Product]
    shop: Shop
  }

  type Product {
    id: ID!
    name: String!
    available: String!
    createdAt: String!
    updatedAt: String!
    shopId: Int!
    boxes: [Box]
    shop: Shop
  }

  type BoxProduct {
    boxId: ID!
    productId: ID!
  }

  type Query {
    getShop(id: Int!): Shop
    getShops: [Shop]
    getProduct(id: Int!): Product
    getProducts(shopId: Int!): [Product]
    getBox(id: Int!): Box
    getBoxes(shopId: Int!): [Box]
  }

  input ShopInput {
    name: String
    shopify_name: String
    email: String
    url: String
  }

  input BoxInput {
    name: String!
    shopId: Int!
  }

  input ProductInput {
    name: String!
    alt_name: String!
    shopId: Int!
  }

  input ProductLooseInput {
    name: String!
  }

  input BoxProductInput {
    boxId: Int!
    productId: Int!
  }

  input BoxCreateProductInput {
    boxId: Int!
    data: ProductLooseInput!
  }

  type Mutation {
    createShop(input: ShopInput!): Shop
    createBox(input: BoxInput!): Box
    createProduct(input: ProductInput!): Product
    boxAddProduct(input: BoxProductInput!): Product
    productAddBox(input: BoxProductInput!): Box
    boxAddCreateProduct(input: BoxCreateProductInput!): Product
  }
`;

const getFieldsFromInfo = (info) => {
  const selections = info.fieldNodes[0] && info.fieldNodes[0].selectionSet && info.fieldNodes[0].selectionSet.selections;
  if (selections) {
    // create array of fields asked for by graphql
    const fields = selections.map((item) => {
      if (item.kind == 'Field' && !item.selectionSet) return item.name.value;
    }).filter(item => item);
    return fields;
  }
  return null;
};

const resolvers = {
  Query: {
    async getShop(root, { id }, { models }, info) {
      return Shop.findByPk(id);
    },
    async getShops(root, args, { models }, info) {
      const fields = getFieldsFromInfo(info);
      return fields ? Shop.findAll({ attributes: fields}) : Shop.findAll();
    },
    async getBox(root, { id }, { models }, info){
      return Box.findByPk(id);
    },
    async getBoxes(root, { shopId }, { models }, info) {
      const fields = getFieldsFromInfo(info);
      return fields ?
        Box.findAll({
          attributes: fields,
          where: { shopId: shopId }
        }) : Box.findAll({ where: { shopId: shopId } });
    },
    async getProduct(root, { id }, { models }, info) {
      return Product.findByPk(id);
    },
    async getProducts(root, { shopId }, { models }, info) {
      var fields = getFieldsFromInfo(info);
      fields = fields.filter(item => item !== '__typename');
      return fields ?
        Product.findAll({
          attributes: fields,
          where: { shopId: shopId }
        }) : Product.findAll({ where: { shopId: shopId } });
    },
  },
  Mutation: {
    async createShop (root, { input }, { models }, info) {
      const { name, shopify_name, email, url } = input;
      return Shop.create({
        name,
        shopify_name,
        email,
        url,
      });
    },
    async createBox (root, { input }, { models }, info) {
      const { name, shopId } = input;
      return Box.create({
        name,
        shopId,
      });
    },
    async createProduct (root, { input }, { models }, info) {
      const { name, shopId } = input;
      return Product.create({
        name,
        shopId,
      })
    },
    async boxAddProduct (root, { input }, { models }, info) {
      const { boxId, productId } = input;
      const box = await Box.findByPk(boxId);
      const product = await Product.findByPk(productId);
      if (box.shopId != product.shopId) {
        throw new UserInputError('Shop ownership does not match for box and product', {
          invalidArgs: Object.keys(args),
        });
      };
      box.addProduct(product);
      return product;
    },
    async productAddBox (root, { input }, { models }, info) {
      const { boxId, productId } = input;
      const box = await Box.findByPk(boxId);
      const product = await Product.findByPk(productId);
      if (box.shopId != product.shopId) {
        throw new UserInputError('Shop ownership does not match for box and product', {
          invalidArgs: Object.keys(args),
        });
      };
      product.addBox(box);
      return box;
    },
    async boxAddCreateProduct (root, { input }, { models }, info) {
      const { boxId, data } = input;
      const box = await Box.findByPk(boxId);
      data.shopId = box.shopId;
      product = box.createProduct(data);
      return product;
    },
  },
  Shop: {
    async boxes(shopObj) {
      return shopObj.getBoxes();
    },
    async products(shopObj) {
      return shopObj.getProducts();
    },
  },
  Box: {
    async products(boxObj) {
      return boxObj.getProducts();
    },
    async shop(boxObj) {
      return await boxObj.getShop();
    },
  },
  Product: {
    async boxes(productObj) {
      return await productObj.getBoxes();
    },
    async shop(boxObj) {
      return boxObj.getShop();
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
