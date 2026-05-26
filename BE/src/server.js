require("dotenv").config();

const express =
  require("express");

const http =
  require("http");

const cors =
  require("cors");


const {
  Server,
} = require("socket.io");


const app = express();

const port =
  process.env.PORT || 5000;

const allowedOrigins =
  (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(
      new Error("Not allowed by CORS")
    );
  },
  credentials: true,
};


const server =
  http.createServer(app);


const io =
  new Server(server, {

    cors: corsOptions,

  });


const sequelize =
  require("./config/database");


const authRoutes =
  require("./routes/authRoutes");

const reportRoutes =
  require("./routes/reportRoutes");

const plcLogRoutes =
  require("./routes/plcLogRoutes");


const {
  connectPLC,
} = require("./services/s7Service");


const {
  initSocket,
} = require("./sockets/socket");


initSocket(io);


app.use(cors(corsOptions));

app.use(express.json());


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


const syncOptions =
  process.env.DB_SYNC_ALTER === "true"
    ? { alter: true }
    : {};

sequelize

  .sync(syncOptions)

  .then(() => {

    console.log(
      "DATABASE CONNECTED"
    );


    connectPLC();


    server.listen(
      port,
      () => {

        console.log(

          `SERVER RUNNING ON ${port}`

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
