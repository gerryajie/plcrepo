const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlcLog = sequelize.define('PlcLog', {
  machineId: DataTypes.INTEGER,
  temperature: DataTypes.FLOAT,
  pressure: DataTypes.FLOAT,
  rpm: DataTypes.FLOAT,
  output: DataTypes.FLOAT,
  status: DataTypes.STRING,
});

module.exports = PlcLog;