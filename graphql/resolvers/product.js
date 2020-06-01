const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Product: {
    async boxes(productObj) {
      return await productObj.getBoxes();
    },
    async shop(boxObj) {
      return await boxObj.getShop();
    },
  },
  Query: {
    async getProduct(root, { input }, { models }, info){
      const { id } = input;
      const fields = getFieldsFromInfo(info);
      return Product.findOne({ 
        where: { id },
        attributes: fields,
      });
    },
    async getProducts(root, { input }, { models }, info) {
      const { shopId, available } = input;
      const where = typeof(available) == 'undefined' ? [true, false] : [available];
      const fields = getFieldsFromInfo(info);
      const products = await Product.findAll({
        attributes: fields,
        where: { shopId: shopId, available: Op.in(where) },
        order: [['name', 'ASC']],
      });
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
      const fields = getFieldsFromInfo(info);
      return Product.findOne({ 
        where: { id },
        attributes: fields,
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
