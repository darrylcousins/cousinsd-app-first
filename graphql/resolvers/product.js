const { Op } = require("sequelize");
const { Product } = require('../../models');

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
      const { ShopId, available } = input;
      const where = typeof(available) == 'undefined' ? [true, false] : [available];
      const products = await Product.findAll({
        where: {
          ShopId: ShopId,
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
      /* title, ShopId, shopify_id, shopify_gid, available */
      return Product.create(input);
    },
    async updateProduct (root, { input }, { models }, info) {
      /* name, id, title, ShopId, shopify_id, shopify_gid, available */
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
