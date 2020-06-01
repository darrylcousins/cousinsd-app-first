'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
      name: {
        type: DataTypes.STRING
        unique: true,
      },
      shopify_name: {
        type: DataTypes.STRING,
        unique: true,
      },
      shopify_id: {
        type: DataTypes.INTEGER
        unique: true,
      },
      email: {
        type: DataTypes.STRING
        unique: true,
        validate: { isEmail: true },
      },
      url: {
        type: DataTypes.STRING
        unique: true,
      },
  }, {});
  Shop.associate = function(models) {
    // associations can be defined here
    Shop.hasMany(models.Box);
    Shop.hasMany(models.Product);
  };
  return Shop;
};
