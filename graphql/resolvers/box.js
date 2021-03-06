const { Op } = require("sequelize");
const { Box } = require('../../models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Box: {
    async products(instance, arguments, context, info) {
      const prods = await instance.getProducts({ order: [['title', 'ASC']] });
      return prods.filter(product => !product.BoxProduct.isAddOn);
    },
    async addOnProducts(instance, arguments, context, info) {
      const prods = await instance.getProducts({ order: [['title', 'ASC']] });
      return prods.filter(product => product.BoxProduct.isAddOn);
    },
    async shop(instance, arguments, context, info) {
      return await instance.getShop();
    },
  },
  Query: {
    async getBox(root, { input }, { models }, info){
      // graphql does not include products
      const { id } = input;
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getBoxes(root, { input }, { models }, info) {
      let { ShopId, delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const boxes = await Box.findAll({
        where: { ShopId, delivered: {[Op.eq]: delivered} },
        order: [['delivered', 'ASC'], ['shopify_gid', 'ASC']],
      });
      return boxes
    },
    async getCurrentBoxes(root, { input }, { models }, info) {
      // return boxes later than a current date (usually today)
      let { ShopId, delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const boxes = await Box.findAll({
        where: { ShopId, delivered: {[Op.gt]: delivered} },
        order: [['delivered', 'ASC'], ['shopify_gid', 'ASC']],
      });
      return boxes
    },
    async getBoxProducts(root, { input }, { models }, info){
      // graphql includes products
      const { id } = input;
      const box = await Box.findOne({ 
        where: { id },
      });
      return box;
    },
    async getBoxesByShopifyId(root, { input }, { models }, info){
      const { shopify_id, ShopId } = input;
      const boxes = await Box.findAll({ 
        where: { shopify_id, ShopId },
        order: [['delivered', 'ASC']],
      });
      return boxes;
    },
    async getBoxDates(root, { input }, { models }, info){
      const dates = await Box.findAll({
        attributes: ['delivered', [sequelize.fn('count', sequelize.col('id')), 'count']],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
      });
      // coerce from array of Orders to simple json
      const data = []
      dates.map((date) => {
          data.push(date.toJSON())
      })
      return data;
    },
  },
  Mutation: {
    async createBox (root, { input }, { models }, info) {
      /* ShopId, shopify_id, shopify_gid, shopify_title, shopify_handle, delivered */
      return Box.create(input);
    },
    async updateBox (root, { input }, { models }, info) {
      /* id, ShopId, shopify_id, shopify_gid, delivered */
      const { id, ...props } = input;
      await Box.update(
        props,
        { where: { id } }
      );
      return await Box.findOne({ 
        where: { id },
      });
    },
    async deleteBox (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      const box = await Box.findByPk(id);
      box.setProducts([]);
      Box.destroy({ where: { id } });
      return id;
    },
  },
};

module.exports = resolvers;
