const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Shop extends Sequelize.Model {};
  Shop.init ({
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.CHAR, length: 128, allowNull: false },
    email: { type: Sequelize.CHAR, length: 128, allowNull: false },
    name: { type: Sequelize.CHAR, length: 128, allowNull: false },
    url: { type: Sequelize.CHAR, length: 128, allowNull: false },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'shops',
  });
  return Shop;
}
