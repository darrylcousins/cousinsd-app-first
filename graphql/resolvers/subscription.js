const { Subscription } = require('../../models');

const resolvers = {
  Subscription: {
    async subscriber(instance, arguments, context, info) {
      return await instance.getSubscriber();
    },
  },
  Query: {
    async getSubscription(root, { input }, { models }, info) {
      const { uid } = input;
      const subscription = await Subscription.findOne({ 
        where: { uid },
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
      const { uid, ...props } = input;
      await Subscription.update(
        props,
        { where: { uid } }
      );
      return Subscription.findOne({ 
        where: { uid },
      });
    },
    async deleteSubscription (root, { input }, { models }, info) {
      /* uid */
      const { uid } = input;
      return Subscription.destroy({ where: { uid } });
    },
  },
};

module.exports = resolvers;


