const { UserInputError } = require("apollo-server-koa");
const { Op } = require("sequelize");
const { Shop, Order, Box } = require('../../models');
const { dateToISOString, getFieldsFromInfo, titleSort } = require('../../lib');
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
    async getOrders(root, { input }, { models }, info) {
      let { ShopId, delivered } = input;
      if (!delivered) delivered = dateToISOString(new Date());
      const orders = await Order.findAll({
        where: { ShopId, delivered: {[Op.eq]: delivered} },
        order: [['delivered', 'ASC']],
      });
      console.log('these ordeers', orders);
      return orders
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
  },

};

module.exports = resolvers;
