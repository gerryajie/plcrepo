let io;

// =====================================
// ACTIVE USER
// =====================================

let activeUsername =
  "system";

// =====================================
// INIT SOCKET
// =====================================

const initSocket = (
  socketIO
) => {

  io = socketIO;

  io.on(
    "connection",
    (socket) => {

      console.log(
        "CLIENT CONNECTED"
      );

      // =====================================
      // USER LOGIN
      // =====================================

      socket.on(
        "user:login",
        (username) => {

          console.log(
            "ACTIVE USER:",
            username
          );

          activeUsername =
            username;

        }
      );

      // =====================================
      // DISCONNECT
      // =====================================

      socket.on(
        "disconnect",
        () => {

          console.log(
            "CLIENT DISCONNECTED"
          );

        }
      );

    }
  );

};

// =====================================
// GET IO
// =====================================

const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;

};

// =====================================
// GET ACTIVE USER
// =====================================

const getActiveUsername =
  () => {

    return activeUsername;

  };

// =====================================

module.exports = {

  initSocket,

  getIO,

  getActiveUsername,

};