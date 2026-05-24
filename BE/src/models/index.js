const { Sequelize, DataTypes } =
  require("sequelize");

// =====================================
// DATABASE CONNECTION
// =====================================

const sequelize = new Sequelize(
  "plc_monitoring", // database
  "root", // username
  "", // password
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// =====================================
// DB OBJECT
// =====================================

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

// =====================================
// MODELS
// =====================================

db.PlcLog = require("./PlcLog")(
  sequelize,
  DataTypes
);

// =====================================

module.exports = db;