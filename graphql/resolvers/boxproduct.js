const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { BoxProduct, Product, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo } = require('../../lib');

const resolvers = {
  Mutation: {
    async addBoxProducts (root, { input }, { models }, info) {
      /* boxId, shopify_gid (product identifier */
      let { productGids, boxId } = input;
      const box = await Box.findByPk(boxId);

      const products = await Product.findAll(
        { where: { shopify_gid: { [Op.in]: productGids }} }
      );
      try {
        await box.addProducts(products);
        return true;
      } catch(e) {
        throw new UserInputError('Failed to add product to box', {
          invalidArgs: Object.keys(args),
        });
      };
    },
    async removeBoxProduct (root, { input }, { models }, info) {
      console.log('got this in removeBoxProduct', input);
      /* boxId, productId */
      const { productId, boxId } = input;
      const boxproduct = await BoxProduct.findOne(
        { where: { BoxId: boxId, ProductId: productId } }
      );
      console.log('Got this boxproduct', boxproduct.id, boxproduct.BoxId, boxproduct.ProductId);
      try {
        const res = await boxproduct.destroy();
        console.log('Result of destroy:', res);
        return true;
      } catch(e) {
        throw new UserInputError('Failed to remove product to box', {
          invalidArgs: Object.keys(input),
        });
      };
    },
  },
};

module.exports = resolvers;

