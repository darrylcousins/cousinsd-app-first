'use strict';
const { Product } = require('./product');
const { Box } = require('./box');

module.exports = (sequelize, DataTypes) => {
  const BoxProduct = sequelize.define('BoxProduct', {
    BoxId: {
      type: DataTypes.INTEGER,
      references: {
        model: Box, // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product, // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {});
  BoxProduct.associate = function(models) {
    // associations can be defined here
  };
  return BoxProduct;
};

