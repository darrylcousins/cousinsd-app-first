'use strict';
const { Shop } = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    shopify_product_id: {
      type: DataTypes.BIGINT,
    },
    frequency: {
      type: DataTypes.ENUM,
      values: ['Weekly', 'Fortnightly', 'Monthly'],
    },
    current_cart: {
      type: DataTypes.JSONB,
    },
    last_cart: {
      type: DataTypes.JSONB,
    },
  }, {});
  Subscription.associate = function(models) {
    // associations can be defined here
    Subscription.belongsTo(models.Subscriber);
  };
  return Subscription;
};

/*
      see theme code for loading cart into product page
      defaultValue: function() {
        return {
          box_id: 0, // shopify_product_id available here
          delivered: null,
          including: [],
          addons: [],
          dislikes: [],
          shopify_title: '',
          shopify_id: 0,
          subscription: true,
          total_price: 0,
          quantities: [],
          is_loaded: true,
        };
      },
      */
