const { Subscription } = require('../../models');

const resolvers = {
  Subscription: {
    async subscriber(instance, arguments, context, info) {
      return await instance.getSubscriber();
    },
  },
  Query: {
    async getSubscription(root, { input }, { models }, info) {
      const { id } = input;
      const subscription = await Subscription.findOne({ 
        where: { id },
      });
      return subscription;
    },
    async getSubscriptions(root, { input }, { models }, info) {
      let { SubscriberId } = input;
      const subscriptions = await Subscription.findAll({
        where: { SubscriberId },
      });
      return subscriptions;
    },
  },
  Mutation: {
    async createSubscription (root, { input }, { models }, info) {
      return Subscription.create(input);
    },
    async updateSubscription (root, { input }, { models }, info) {
      const { id, ...props } = input;
      await Subscription.update(
        props,
        { where: { id } }
      );
      return Subscription.findOne({ 
        where: { id },
      });
    },
    async deleteSubscription (root, { input }, { models }, info) {
      /* id */
      const { id } = input;
      return Subscription.destroy({ where: { id } });
    },
  },
};

module.exports = resolvers;


