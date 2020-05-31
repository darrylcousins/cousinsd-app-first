'use strict';
const Shop = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
    },
    handle: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    storeProductId: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    shopId: {
      type: DataTypes.INTEGER,
      references: {
        model: Shop, // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      unique: 'compositeIndex',
    },
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Box, { through: 'BoxProduct' });
    Product.belongsTo(models.Shop);
  };
  return Product;
};
