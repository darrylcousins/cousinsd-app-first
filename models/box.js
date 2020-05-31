'use strict';
const Shop = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Box = sequelize.define('Box', {
    name: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    delivered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      unique: 'compositeIndex',
    },
    storeProductId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
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
  Box.associate = function(models) {
    // associations can be defined here
    Box.belongsToMany(models.Product, { through: 'BoxProduct' });
    Box.belongsTo(models.Shop);
  };
  return Box;
};
