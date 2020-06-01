const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Shop: {
    async boxes(shopObj) {
      return await shopObj.getBoxes();
    },
    async products(shopObj) {
      return await shopObj.getProducts();
    },
  },
  Query: {
    async getShop(root, { input }, { models }, info) {
      const fields = getFieldsFromInfo(info);
      const { id } = input;
      const shop = await Shop.findOne({ 
        where: { id },
        attributes: fields,
      });
      return shop;
    },
    async getShops(root, args, { models }, info) {
      const fields = getFieldsFromInfo(info);
      return Shop.findAll({
        attributes: fields
      });
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
      const fields = getFieldsFromInfo(info);
      return Shop.findOne({ 
        where: { id },
        attributes: fields,
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
