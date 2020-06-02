const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Shop: {
    async boxes(instance, arguments, context, info) {
      return await instance.getBoxes();
    },
    async products(instance, arguments, context, info) {
      return await instance.getProducts();
    },
  },
  Query: {
    async getShop(root, { input }, { models }, info) {
      const { id } = input;
      const shop = await Shop.findOne({ 
        where: { id },
      });
      return shop;
    },
    async getShops(root, args, { models }, info) {
      return Shop.findAll();
    },
  },
  Mutation: {
    async createShop (root, { input }, { models }, info) {
      /* name, email, url, shopify_id, shopify_name */
      return Shop.create(input);
    },
    async updateShop (root, { input }, { models }, info) {
      /* id, name, email, url, shopify_id, shopify_name */
      const { id, ...props } = input;
      await Shop.update(
        props,
        { where: { id } }
      );
      return Shop.findOne({ 
        where: { id },
      });
    },
    async deleteShop (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      return Shop.destroy({ where: { id } });
    },
  },
};

module.exports = resolvers;
