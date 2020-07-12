'use strict';
const { Shop } = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Subscriber = sequelize.define('Subscriber', {
    shopify_customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: { isInt: true },
      unique: 'compositeIndex',
    },
  }, {});
  Subscriber.associate = function(models) {
    // associations can be defined here
    Subscriber.hasMany(models.Subscription);
    Subscriber.belongsTo(models.Shop);
  };
  return Subscriber;
};

/* other possible fields:
 * credit = amount of paid up credit for subscription
 */
