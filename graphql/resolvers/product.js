const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Product: {
    async boxes(instance, arguments, context, info) {
      return await instance.getBoxes();
    },
    async shop(instance, arguments, context, info) {
      return await instance.getShop();
    },
  },
  Query: {
    async getProduct(root, { input }, { models }, info){
      const { id } = input;
      return Product.findOne({ 
        where: { id },
      });
    },
    async getProducts(root, { input }, { models }, info) {
      const { shopId, available } = input;
      const where = typeof(available) == 'undefined' ? [true, false] : [available];
      console.log('Where?', where);
      const products = await Product.findAll({
        where: {
          shopId: shopId,
          available: {
            [Op.in]: where
          }
        },
        order: [['title', 'ASC']],
      });
      console.log('got these:', products);
      return products
    },
  },
  Mutation: {
    async createProduct (root, { input }, { models }, info) {
      /* name, handle, shopId, shopify_id, shopify_gid, available */
      return Product.create(input);
    },
    async updateProduct (root, { input }, { models }, info) {
      /* name, id, handle, shopId, shopify_id, shopify_gid, available */
      const { id, ...props } = input;
      await Product.update(
        props,
        { where: { id } }
      );
      return Product.findOne({ 
        where: { id },
      });
    },
    async deleteProduct (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      return Product.destroy({ where: { id } });
    },
  },
};

module.exports = resolvers;
