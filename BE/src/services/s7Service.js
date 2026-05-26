const snap7 = require("node-snap7");

const db = require("../models");

const PLCLog = db.PlcLog;

const client =
  new snap7.S7Client();

const plcConfig = {
  plcName:
    process.env.PLC_NAME || "Siemens S7 PLC",
  plcIp:
    process.env.PLC_IP || "192.168.1.10",
  plcRack:
    Number(process.env.PLC_RACK ?? 0),
  plcSlot:
    Number(process.env.PLC_SLOT ?? 1),
};

const {
  getIO,
  getActiveUsername,
  setPlcStatus,
} = require("../sockets/socket");


let pollingStarted = false;


let previousState = null;

function emitPlcStatus(status) {

  const payload = {
    ...plcConfig,
    status,
    connected:
      status === "connected",
  };

  setPlcStatus(payload);

  try {

    getIO().emit(
      "plc:status",
      payload
    );

  } catch {


  }

}


function connectPLC() {

  console.log(
    "TRY CONNECT PLC..."
  );

  emitPlcStatus("connecting");

  const connected =
    client.ConnectTo(
      plcConfig.plcIp,
      plcConfig.plcRack,
      plcConfig.plcSlot
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


    if (
      !client.Connected()
    ) {

      console.log(
        "PLC NOT CONNECTED"
      );

      emitPlcStatus("disconnected");

      reconnect();

      return;

    }

    console.log(
      "PLC CONNECTED"
    );

    emitPlcStatus("connected");


    startPolling();

  }, 2000);

}


function reconnect() {

  setTimeout(() => {

    console.log(
      "RECONNECT PLC..."
    );

    connectPLC();

  }, 5000);

}


function startPolling() {


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


  setInterval(() => {

    client.MBRead(
      10,
      1,

      async (
        err,
        res
      ) => {


        if (err) {

          console.log(
            "READ ERROR:",
            client.ErrorText(err)
          );

          return;

        }


        const byte =
          res[0];


        const plcData = {

          ...plcConfig,

          connected:
            client.Connected(),

          status:
            "connected",

          startEngine:
            (byte & 1) !== 0,

          batteryLow:
            (byte & 2) !== 0,

          shortCircuit:
            (byte & 4) !== 0,

          timePreventive:
            (byte & 8) !== 0,

        };


        getIO().emit(
          "plc:data",
          plcData
        );


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


        const changes = [];


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


        if (
          changes.length === 0
        ) {

          return;

        }


        console.log(
          "PLC CHANGED:",
          changes
        );

        for (
          const log of changes
        ) {

          await PLCLog.create(log);

        }


        previousState = {
          ...plcData,
        };

      }

    );

  }, 1000);

}


module.exports = {

  connectPLC,

};
