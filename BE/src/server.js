require("dotenv").config();

const express =
  require("express");

const http =
  require("http");

const cors =
  require("cors");

// =====================================
// SOCKET IO
// =====================================

const {
  Server,
} = require("socket.io");

// =====================================
// EXPRESS
// =====================================

const app = express();

// =====================================
// HTTP SERVER
// =====================================

const server =
  http.createServer(app);

// =====================================
// SOCKET IO INSTANCE
// =====================================

const io =
  new Server(server, {

    cors: {
      origin: "*",
    },

  });

// =====================================
// DATABASE
// =====================================

const sequelize =
  require("./config/database");

// =====================================
// ROUTES
// =====================================

const authRoutes =
  require("./routes/authRoutes");

const reportRoutes =
  require("./routes/reportRoutes");

const plcLogRoutes =
  require("./routes/plcLogRoutes");

// =====================================
// PLC
// =====================================

const {
  connectPLC,
} = require("./services/s7Service");

// =====================================
// SOCKET INIT
// =====================================

const {
  initSocket,
} = require("./sockets/socket");

// =====================================
// INIT SOCKET
// =====================================

initSocket(io);

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/plc-logs",
  plcLogRoutes
);

// =====================================
// DATABASE SYNC
// =====================================

sequelize

  .sync({ alter: true })

  .then(() => {

    console.log(
      "DATABASE CONNECTED"
    );

    // =====================================
    // CONNECT PLC
    // =====================================

    connectPLC();

    // =====================================
    // START SERVER
    // =====================================

    server.listen(
      process.env.PORT,
      () => {

        console.log(

          `SERVER RUNNING ON ${process.env.PORT}`

        );

      }
    );

  })

  .catch((err) => {

    console.log(
      "DATABASE ERROR:",
      err
    );

  });