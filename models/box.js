'use strict';
const { Shop } = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Box = sequelize.define('Box', {
    shopify_handle: {
      type: DataTypes.STRING,
    },
    shopify_title: {
      type: DataTypes.STRING,
    },
    shopify_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: { isInt: true },
      unique: 'compositeIndex',
    },
    shopify_gid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopify_variant_id: {
      type: DataTypes.BIGINT,
    },
    shopify_price: {
      type: DataTypes.INTEGER,
    },
    delivered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      unique: 'compositeIndex',
    },
  }, {});
  Box.associate = function(models) {
    // associations can be defined here
    Box.belongsToMany(models.Product, { through: 'BoxProduct' });
    Box.belongsTo(models.Shop);
  };
  return Box;
};
