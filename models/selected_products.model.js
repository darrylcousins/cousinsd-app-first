const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class SelectedProducts extends Sequelize.Model {};
  SelectedProducts.init ({
    shop_id: { type: Sequelize.INTEGER, primaryKey: true },
    product_ids: { type: Sequelize.STRING, allowNull: false },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'temp_selected_products',
  });
  return SelectedProducts;
}

