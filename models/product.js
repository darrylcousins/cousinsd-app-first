'use strict';
const { Shop } = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    shopify_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: 'compositeIndex',
    },
    shopify_gid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    shopify_handle: {
      type: DataTypes.STRING,
    },
    shopify_variant_id: {
      type: DataTypes.BIGINT,
    },
    shopify_price: {
      type: DataTypes.INTEGER,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: '0',
    },
    /*
    shopId: {
      type: DataTypes.INTEGER,
      references: {
        model: Shop, // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    */
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Box, { through: 'BoxProduct' });
    Product.belongsTo(models.Shop);
  };
  return Product;
};
