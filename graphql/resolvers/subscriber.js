const { Shop, Subscriber, Subscription } = require('../../models');

const resolvers = {
  Subscriber: {
    async subscriptions(instance, arguments, context, info) {
      return await instance.getSubscriptions();
    },
  },
  Query: {
    async getSubscriber(root, { input }, { models }, info) {
      const { uid } = input;
      const subscriber = await Subscriber.findOne({ 
        where: { uid },
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
      const { uid, ...props } = input;
      await Subscriber.update(
        props,
        { where: { uid } }
      );
      return Subscriber.findOne({ 
        where: { uid },
      });
    },
    async deleteSubscriber (root, { input }, { models }, info) {
      /* id */
      const { uid } = input;
      return Subscriber.destroy({ where: { uid } });
    },
  },
};

module.exports = resolvers;

