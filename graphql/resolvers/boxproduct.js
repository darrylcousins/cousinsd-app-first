const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { BoxProduct, Product, Box } = require('../../models');

const resolvers = {
  Mutation: {
    async addBoxProducts (root, { input }, { models }, info) {
      /* boxId, shopify_gid (product identifier */
      let { productGids, boxId, isAddOn } = input;
      const box = await Box.findByPk(boxId);

      // array of { shopify_id, isAddOn }
      //const productGids = inputs.map(item => item.shopify_id);

      const products = await Product.findAll(
        { where: { shopify_gid: { [Op.in]: productGids }} }
      );

      try {
        products.forEach((product) => {
          var values = { isAddOn, BoxId: boxId, ProductId: product.id };
          // find ob in the array
          var bp = BoxProduct.upsert(values);
          console.log('bp', bp.BoxId, bp.isAddOn, bp.ProductId);
        });
        return true;
      } catch(e) {
        console.log(e);
        throw(e);
      };
    },
    async removeBoxProduct (root, { input }, { models }, info) {
      console.log('got this in removeBoxProduct', input);
      /* boxId, productId */
      const { productId, boxId, isAddOn } = input;
      const boxproduct = await BoxProduct.findOne(
        { where: { BoxId: boxId, ProductId: productId, isAddOn: isAddOn } }
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

