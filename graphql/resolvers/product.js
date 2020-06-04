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
      const products = await Product.findAll({
        where: {
          shopId: shopId,
          available: {
            [Op.in]: where
          }
        },
        order: [['title', 'ASC']],
      });
      return products
    },
  },
  Mutation: {
    async createProduct (root, { input }, { models }, info) {
      /* title, shopId, shopify_id, shopify_gid, available */
      return Product.create(input);
    },
    async updateProduct (root, { input }, { models }, info) {
      /* name, id, title, shopId, shopify_id, shopify_gid, available */
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
      Product.destroy({ where: { id } });
      return id;
    },
    async toggleProductAvailable (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Product.update(
        props,
        { where: { id } }
      );
      return Product.findOne({ 
        where: { id },
      });
    },
  },
};

module.exports = resolvers;
