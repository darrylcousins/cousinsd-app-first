const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Box: {
    async products(instance, arguments, context, info) {
      return await instance.getProducts();
    },
    async shop(instance, arguments, context, info) {
      return await instance.getShop();
    },
  },
  Query: {
    async getBox(root, { input }, { models }, info){
      const { id } = input;
      const fields = getFieldsFromInfo(info);
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getBoxes(root, { input }, { models }, info) {
      let { shopId, delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const boxes = await Box.findAll({
        where: { shopId: shopId, delivered: {[Op.gt]: delivered} },
        order: [['delivered', 'ASC']],
      });
      return boxes
    },
  },
  Mutation: {
    async createBox (root, { input }, { models }, info) {
      /* handle, shopId, shopify_id, shopify_gid, delivered */
      return Box.create(input);
    },
    async updateBox (root, { input }, { models }, info) {
      /* id, handle, shopId, shopify_id, shopify_gid, delivered */
      const { id, ...props } = input;
      await Box.update(
        props,
        { where: { id } }
      );
      const fields = getFieldsFromInfo(info);
      return Box.findOne({ 
        where: { id },
        attributes: fields,
      });
    },
    async deleteBox (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      return Box.destroy({ where: { id } });
    },
  },
};

module.exports = resolvers;