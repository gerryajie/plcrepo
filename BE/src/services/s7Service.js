const snap7 = require("node-snap7");

const db = require("../models");

const PLCLog = db.PlcLog;

const client =
  new snap7.S7Client();

const {
  getIO,
  getActiveUsername,
} = require("../sockets/socket");

// =====================================
// GLOBAL STATE
// =====================================

let pollingStarted = false;

// STATE TERAKHIR PLC

let previousState = null;

// =====================================
// CONNECT PLC
// =====================================

function connectPLC() {

  console.log(
    "TRY CONNECT PLC..."
  );

  const connected =
    client.ConnectTo(
      "192.168.1.10",
      0,
      1
    );

  console.log(
    "CONNECT RESULT:",
    connected
  );

  setTimeout(() => {

    console.log(
      "CONNECTED:",
      client.Connected()
    );

    // =====================================
    // PLC NOT CONNECTED
    // =====================================

    if (
      !client.Connected()
    ) {

      console.log(
        "PLC NOT CONNECTED"
      );

      reconnect();

      return;

    }

    console.log(
      "PLC CONNECTED"
    );

    // =====================================
    // START POLLING
    // =====================================

    startPolling();

  }, 2000);

}

// =====================================
// RECONNECT
// =====================================

function reconnect() {

  setTimeout(() => {

    console.log(
      "RECONNECT PLC..."
    );

    connectPLC();

  }, 5000);

}

// =====================================
// START POLLING
// =====================================

function startPolling() {

  // =====================================
  // PREVENT MULTIPLE POLLING
  // =====================================

  if (pollingStarted) {

    console.log(
      "POLLING ALREADY STARTED"
    );

    return;

  }

  pollingStarted = true;

  console.log(
    "START PLC POLLING..."
  );

  // =====================================

  setInterval(() => {

    client.MBRead(
      10,
      1,

      async (
        err,
        res
      ) => {

        // =====================================
        // ERROR
        // =====================================

        if (err) {

          console.log(
            "READ ERROR:",
            client.ErrorText(err)
          );

          return;

        }

        // =====================================
        // BYTE PLC
        // =====================================

        const byte =
          res[0];

        // =====================================
        // PLC DATA
        // =====================================

        const plcData = {

          startEngine:
            (byte & 1) !== 0,

          batteryLow:
            (byte & 2) !== 0,

          shortCircuit:
            (byte & 4) !== 0,

          timePreventive:
            (byte & 8) !== 0,

        };

        // =====================================
        // REALTIME SOCKET
        // =====================================

        getIO().emit(
          "plc:data",
          plcData
        );

        // =====================================
        // FIRST INIT
        // =====================================

        if (
          previousState === null
        ) {

          previousState = {
            ...plcData,
          };

          console.log(
            "INITIAL PLC STATE SAVED"
          );

          return;

        }

        // =====================================
        // CHANGES
        // =====================================

        const changes = [];

        // =====================================
        // START ENGINE
        // =====================================

        if (

          previousState.startEngine
          !== plcData.startEngine

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.startEngine

                ? "START ENGINE RUNNING"

                : "START ENGINE STOP",

          });

        }

        // =====================================
        // BATTERY LOW
        // =====================================

        if (

          previousState.batteryLow
          !== plcData.batteryLow

        ) {

          changes.push({
            username:
              getActiveUsername(),

            message:
              plcData.batteryLow

                ? "BATTERY LOW DETECTED"

                : "BATTERY NORMAL",

          });

        }

        // =====================================
        // SHORT CIRCUIT
        // =====================================

        if (

          previousState.shortCircuit
          !== plcData.shortCircuit

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.shortCircuit

                ? "SHORT CIRCUIT DETECTED"

                : "SHORT CIRCUIT SAFE",

          });

        }

        // =====================================
        // TIME PREVENTIVE
        // =====================================

        if (

          previousState.timePreventive
          !== plcData.timePreventive

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.timePreventive

                ? "TIME PREVENTIVE ACTIVE"

                : "TIME PREVENTIVE NORMAL",

          });

        }

        // =====================================
        // NO CHANGE
        // =====================================

        if (
          changes.length === 0
        ) {

          return;

        }

        // =====================================
        // SAVE LOGS
        // =====================================

        console.log(
          "PLC CHANGED:",
          changes
        );

        for (
          const log of changes
        ) {

          await PLCLog.create(log);

        }

        // =====================================
        // UPDATE STATE
        // =====================================

        previousState = {
          ...plcData,
        };

      }

    );

  }, 1000);

}

// =====================================

module.exports = {

  connectPLC,

};