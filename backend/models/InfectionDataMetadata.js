const { DataTypes } = require('sequelize');
const InfectionDataMetadataModel = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },

  group: {
    type: DataTypes.STRING,
    allowNull: true
  },

  label: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true
  }

};

module.exports = (sequelize) => sequelize.define('InfectionDataMetadata', InfectionDataMetadataModel);
