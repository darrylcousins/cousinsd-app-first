'use strict';
const Shop = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    alt_name: DataTypes.STRING,
    available: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    },
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Box, { through: 'BoxProduct' });
    Product.belongsTo(models.Shop);
  };
  return Product;
};
