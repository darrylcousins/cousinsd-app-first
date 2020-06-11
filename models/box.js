'use strict';
const { Shop } = require('./shop');

module.exports = (sequelize, DataTypes) => {
  const Box = sequelize.define('Box', {
    title: {
      type: DataTypes.STRING,
    },
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
    delivered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      unique: 'compositeIndex',
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
      unique: 'compositeIndex',
    },
    */
  }, {});
  Box.associate = function(models) {
    // associations can be defined here
    Box.belongsToMany(models.Product, { through: 'BoxProduct' });
    Box.belongsTo(models.Shop);
  };
  return Box;
};
