const { Op } = require("sequelize");
const { Order } = require('../../models');
const { dateToISOString } = require('../../lib');
const sequelize = require('sequelize');

const resolvers = {
  Order: {
    async shop(instance, arguments, context, info) {
      return await instance.getShop();
    },
  },
  Query: {
    async getOrder(root, { input }, { models }, info){
      const { id } = input;
      const order = await Order.findOne({ 
        where: { id },
      });
      return order;
    },
    async getAllOrders(root, { input }, { models }, info) {
      let { ShopId } = input;
      const orders = await Order.findAll({
        where: { ShopId },
      });
      return orders
    },
    async getOrders(root, { input }, { models }, info) {
      console.log(input);
      let { ShopId, delivered, limit, offset, shopify_product_id } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const where = { ShopId, delivered: {[Op.eq]: delivered} };
      if (shopify_product_id) where.shopify_product_id = shopify_product_id;
      console.log(where);
      const orders = await Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [['delivered', 'ASC']],
      });
      return orders;
    },
    async getOrderDates(root, { input }, { models }, info){
      const dates = await Order.findAll({
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
    async checkOrderDuplicate(root, { input }, { models }, info) {
      let { ShopId, delivered, shopify_product_id, shopify_customer_id } = input;
      const order = await Order.findOne({
        where: { ShopId, delivered: {[Op.eq]: delivered}, shopify_product_id, shopify_customer_id },
      });
      return order;
    },
  },

};

module.exports = resolvers;
