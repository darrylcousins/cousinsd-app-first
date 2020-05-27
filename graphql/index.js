const { ApolloServer, gql, UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
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
    getBoxes(shopId: Int!, delivered: String!): [Box]
    boxGetDeselectedProducts(boxId: Int!): [Product]
  }

  input ShopInput {
    name: String
    shopify_name: String
    email: String
    url: String
  }

  input BoxInput {
    name: String!
    delivered: String!
    shopId: Int!
  }

  input ProductInput {
    name: String!
    alt_name: String
    shopId: Int!
    available: String
  }

  input ProductLooseInput {
    productId: Int
    name: String!
  }

  input BoxProductInput {
    boxId: Int!
    productId: Int!
  }

  input BoxDeliveredInput {
    boxId: Int!
    delivered: String!
  }

  input BoxCreateProductInput {
    boxId: Int!
    data: ProductLooseInput!
  }

  input BoxDeleteInput {
    boxId: Int!
  }

  input ProductSimpleInput {
    productId: Int!
  }

  type Mutation {
    createShop(input: ShopInput!): Shop
    createBox(input: BoxInput!): Box
    deleteBox(input: BoxDeleteInput!): Int
    createProduct(input: ProductInput!): Product
    boxAddProduct(input: BoxProductInput!): Product
    boxRemoveProduct(input: BoxProductInput!): Box
    productAddBox(input: BoxProductInput!): Box
    boxAddCreateProduct(input: BoxCreateProductInput!): Product
    boxUpdateDelivered(input: BoxDeliveredInput!): Box
    toggleProductAvailable(input: ProductSimpleInput!): Product
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
    async getBoxes(root, { shopId, delivered}, { models }, info) {
      var fields = getFieldsFromInfo(info);
      fields = fields.filter(item => item !== '__typename');
      return fields ?
        Box.findAll({
          attributes: fields,
          where: { shopId: shopId, delivered: {[Op.gt]: delivered} },
          order: [['delivered', 'DESC']],
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
          where: { shopId: shopId },
          order: [['name', 'ASC']],
        }) : Product.findAll({ 
          where: { shopId: shopId },
          order: [['name', 'ASC']],
        });
    },
    async boxGetDeselectedProducts(root, { boxId }, { models }, info) {
      // TODO There must be better way with only one sql call
      const box = await Box.findByPk(boxId);
      const products = await box.getProducts({
        attributes: ['id'],
        raw: true,
      });
      const productIds = products.map((product) => product.id);
      return Product.findAll({
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.notIn]: productIds
          },
          available: 1,
        }
      });
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
      const { name, shopId, delivered } = input;
      return Box.create({
        name,
        shopId,
        delivered,
      });
    },
    async deleteBox (root, { input }, { models }, info) {
      const { boxId } = input;
      const box = await Box.findByPk(boxId);
      box.destroy();
      return boxId;
    },
    async createProduct (root, { input }, { models }, info) {
      const { name, alt_name, available, shopId } = input;
      return Product.create({
        name,
        alt_name,
        available,
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
      await box.addProduct(product);
      return product;
    },
    async boxRemoveProduct (root, { input }, { models }, info) {
      const { boxId, productId } = input;
      const box = await Box.findByPk(boxId);
      const product = await Product.findByPk(productId);
      await box.removeProduct(product);
      return box;
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
      const { productId, ...productData } = data;
      let product = null;
      if (productId) {
        product = await Product.findByPk(productId);
        if (box.shopId != product.shopId) {
          throw new UserInputError('Shop ownership does not match for box and product', {
            invalidArgs: Object.keys(args),
          });
        };
        const hasProduct = await box.hasProduct(product);
        if (!hasProduct) box.addProduct(product);
      } else {
        productData.shopId = box.shopId;
        product = await box.createProduct(productData);
      }
      return product;
    },
    async boxUpdateDelivered (root, { input }, { models }, info) {
      const { boxId, delivered } = input;
      console.log(input, boxId, delivered);
      var box = await Box.findByPk(boxId);
      box.delivered = delivered;
      await box.save();
      return box;
    },
    async toggleProductAvailable (root, { input }, { models }, info) {
      const { productId } = input;
      var product = await Product.findByPk(productId);
      product.available = !product.availabe;
      await product.save();
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
