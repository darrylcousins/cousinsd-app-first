const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Box extends Sequelize.Model {};
  Box.init ({
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
    delivery_date: { 
      type: Sequelize.INTEGER, 
      allowNull: false 
    },
    created: { 
      type: Sequelize.INTEGER, 
      allowNull: false 
    },
  }, {
    sequelize,
    timestamps: true,
    tableName: 'box'
  });
  return Box;
}

