require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require("./routes/reportRoutes");

const dummyPlcSimulator = require('./simulators/dummyPlcSimulator');

const socket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

socket.init(server);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/reports", reportRoutes);


sequelize.sync().then(() => {
  console.log('Database Connected');

  dummyPlcSimulator();

  server.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
  });
});