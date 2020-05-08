const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Produce extends Sequelize.Model {};
  Produce.init ({
    id: { 
      type: Sequelize.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    name: { 
      type: Sequelize.CHAR, 
      length: 128, 
      allowNull: false 
    },
    alt_name: { 
      type: Sequelize.CHAR, 
      length: 128, 
      allowNull: false 
    },
    created: { 
      type: Sequelize.INTEGER, 
      allowNull: false 
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'produce',
  });
  return Produce;
}

