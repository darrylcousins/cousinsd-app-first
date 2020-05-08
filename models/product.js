'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    alt_name: DataTypes.STRING,
    available: DataTypes.DATE
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsToMany(models.Box, { through: 'BoxProduct' });
    Product.belongsTo(models.Shop);
  };
  return Product;
};
