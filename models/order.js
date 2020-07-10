'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    shopify_name: {
      type: DataTypes.STRING,
    },
    shopify_order_id: {
      type: DataTypes.BIGINT,
    },
    shopify_product_id: {
      type: DataTypes.BIGINT,
    },
    shopify_line_item_id: {
      type: DataTypes.BIGINT,
    },
    shopify_customer_id: {
      type: DataTypes.BIGINT,
    },
    delivered: {
      type: DataTypes.DATE,
    },
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Shop);
  };
  return Order;
};

