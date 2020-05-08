'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    name: DataTypes.STRING,
    shopify_name: DataTypes.STRING,
    email: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  Shop.associate = function(models) {
    // associations can be defined here
    Shop.hasMany(models.Box);
    Shop.hasMany(models.Product);
  };
  return Shop;
};
