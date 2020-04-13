const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Shop extends Sequelize.Model {};
  Shop.init ({
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
  }, {
    sequelize,
    timestamps: false,
  });
  return Shop;
}
