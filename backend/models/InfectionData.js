const { DataTypes } = require('sequelize');
const InfectionDataModel = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },

  admin0Id: {
    type: DataTypes.STRING,
    allowNull: false
  },

  admin1Id: {
    type: DataTypes.STRING,
    allowNull: false
  },

  summaryTypeId: {
    type: DataTypes.STRING,
    allowNull: false
  },

  indicatorId: {
    type: DataTypes.STRING,
    allowNull: false
  },

  ageGroupId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
};

module.exports = (sequelize) => sequelize.define('infectionData', InfectionDataModel, {
  indexes: [
    { fields: ['admin0Id', 'indicatorId', 'summaryTypeId'] },
    { fields: ['admin0Id', 'indicatorId', 'admin1Id'] },
  ]
});