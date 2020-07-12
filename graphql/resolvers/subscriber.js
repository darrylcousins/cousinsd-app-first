const { Shop, Subscriber, Subscription } = require('../../models');

const resolvers = {
  Subscriber: {
    async subscriptions(instance, arguments, context, info) {
      return await instance.getSubscriptions();
    },
  },
  Query: {
    async getSubscriber(root, { input }, { models }, info) {
      const { id } = input;
      const subscriber = await Subscriber.findOne({ 
        where: { id },
      });
      return subscriber;
    },
    async getSubscribers(root, { input }, { models }, info) {
      let { ShopId } = input;
      const subscribers = await Subscriber.findAll({
        where: { ShopId },
      });
      return subscribers;
    },
  },
  Mutation: {
    async createSubscriber (root, { input }, { models }, info) {
      return Subscriber.create(input);
    },
    async updateSubscriber (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Subscriber.update(
        props,
        { where: { id } }
      );
      return Subscriber.findOne({ 
        where: { id },
      });
    },
    async deleteSubscriber (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      return Subscriber.destroy({ where: { id } });
    },
  },
};

module.exports = resolvers;

