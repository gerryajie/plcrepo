// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import socket from "../socket/socket";
import axios from "axios";

import {
  Cpu,
  Battery,
  ShieldAlert,
  TimerReset,
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function Dashboard() {

  // =========================================
  // PLC DATA
  // =========================================

  const [plcData, setPlcData] = useState({
    startEngine: false,
    batteryLow: false,
    shortCircuit: false,
    timePreventive: false,
  });

  // =========================================
  // PREVIOUS DATA
  // =========================================

  const [prevData, setPrevData] = useState({
    startEngine: false,
    batteryLow: false,
    shortCircuit: false,
    timePreventive: false,
  });

  // =========================================
  // TIMELINE
  // =========================================

  const [timeline, setTimeline] = useState([]);

  // =========================================
  // CLOCK
  // =========================================

  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  // =========================================
  // USER
  // =========================================

  const username =
    localStorage.getItem("username") || "Operator";

  // =========================================
  // REALTIME CLOCK
  // =========================================

 useEffect(() => {

  const username =
    localStorage.getItem(
      "username"
    );

  // =====================================
  // SEND USER LOGIN
  // =====================================

  if (username) {

    socket.emit(
      "user:login",
      username
    );

    console.log(
      "LOGIN USER:",
      username
    );

  }

}, []);

  // =========================================
  // SOCKET PLC
  // =========================================

  useEffect(() => {

    socket.on("plc:data", (data) => {

      setPlcData(data);

      let eventMessage = "";

      // =====================================
      // START ENGINE
      // =====================================

      if (
        data.startEngine !== prevData.startEngine
      ) {

        eventMessage = data.startEngine
          ? "START ENGINE RUNNING"
          : "START ENGINE STOPPED";

      }

      // =====================================
      // BATTERY
      // =====================================

      if (
        data.batteryLow !== prevData.batteryLow
      ) {

        eventMessage = data.batteryLow
          ? "BATTERY LOW DETECTED"
          : "BATTERY NORMAL";

      }

      // =====================================
      // SHORT CIRCUIT
      // =====================================

      if (
        data.shortCircuit !== prevData.shortCircuit
      ) {

        eventMessage = data.shortCircuit
          ? "SHORT CIRCUIT DETECTED"
          : "SHORT CIRCUIT SAFE";

      }

      // =====================================
      // PREVENTIVE
      // =====================================

      if (
        data.timePreventive !== prevData.timePreventive
      ) {

        eventMessage = data.timePreventive
          ? "TIME PREVENTIVE ACTIVE"
          : "TIME PREVENTIVE NORMAL";

      }

      // =====================================
      // PUSH TIMELINE
      // =====================================

      if (eventMessage !== "") {

        const username =
          localStorage.getItem("username")
          || "Operator";

        // TIMELINE

        setTimeline((prev) => [

          {
            message: eventMessage,
            createdAt: new Date(),
          },

          ...prev,

        ]);

        // SAVE DB

        // axios.post(
        //   "http://localhost:5000/api/plc-logs",
        //   {
        //     username,
        //     message: eventMessage,
        //   }
        // );

      }

      setPrevData(data);

    });

    return () => {

      socket.off("plc:data");

    };

  }, [prevData]);

  return (

    <MainLayout>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="bg-[#081028] border border-[#1e293b] rounded-3xl p-6 mb-8 flex justify-between items-center">

        {/* LEFT */}

        <div>

          <h1 className="text-5xl font-bold italic text-white">

            Industrial SCADA System

          </h1>

          <p className="text-gray-400 mt-2 text-lg">

            Siemens PLC Monitoring

          </p>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-5">

          {/* USER */}

          <div className="bg-[#111c36] border border-[#1e293b] rounded-2xl px-5 py-3 flex items-center gap-4 shadow-lg">

            {/* AVATAR */}

            <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-black font-bold text-xl">

              {username.charAt(0).toUpperCase()}

            </div>

            {/* USER INFO */}

            <div>

              <p className="text-gray-400 text-sm">

                Hallo

              </p>

              <h1 className="font-bold text-green-400 text-lg">

                {username}

              </h1>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* STATUS CARD */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatusCard
          title="START ENGINE"
          value={plcData.startEngine ? "RUNNING" : "STOP"}
          color="text-green-400"
          icon={<Cpu className="text-green-400" />}
        />

        <StatusCard
          title="BATTERY LOW"
          value={plcData.batteryLow ? "LOW" : "NORMAL"}
          color="text-yellow-400"
          icon={<Battery className="text-yellow-400" />}
        />

        <StatusCard
          title="SHORT CIRCUIT"
          value={plcData.shortCircuit ? "DETECTED" : "SAFE"}
          color="text-red-400"
          icon={<ShieldAlert className="text-red-400" />}
        />

        <StatusCard
          title="TIME PREVENTIVE"
          value={plcData.timePreventive ? "ACTIVE" : "NORMAL"}
          color="text-blue-400"
          icon={<TimerReset className="text-blue-400" />}
        />

      </div>

      {/* ========================================= */}
      {/* DONUT */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <DonutCard
          title="START ENGINE"
          value={plcData.startEngine ? 100 : 0}
          text={plcData.startEngine ? "ON" : "OFF"}
          color="#22c55e"
          label={plcData.startEngine ? "RUNNING" : "STOP"}
        />

        <DonutCard
          title="BATTERY LOW"
          value={plcData.batteryLow ? 100 : 0}
          text={plcData.batteryLow ? "ON" : "OFF"}
          color="#eab308"
          label={plcData.batteryLow ? "LOW" : "NORMAL"}
        />

        <DonutCard
          title="SHORT CIRCUIT"
          value={plcData.shortCircuit ? 100 : 0}
          text={plcData.shortCircuit ? "ON" : "OFF"}
          color="#ef4444"
          label={plcData.shortCircuit ? "FAULT" : "SAFE"}
        />

        <DonutCard
          title="TIME PREVENTIVE"
          value={plcData.timePreventive ? 100 : 0}
          text={plcData.timePreventive ? "ON" : "OFF"}
          color="#3b82f6"
          label={plcData.timePreventive ? "ACTIVE" : "NORMAL"}
        />

      </div>

      {/* ========================================= */}
      {/* ACTIVE ALARM + TIMELINE */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ACTIVE ALARM */}

        <div className="bg-[#081028] border border-[#1e293b] rounded-3xl p-6">

          <h1 className="text-3xl font-bold mb-8">

            Active Alarm

          </h1>

          <div className="space-y-5">

            {plcData.startEngine && (

              <AlarmCard
                text="START ENGINE RUNNING"
                border="border-green-500"
                dot="bg-green-400"
              />

            )}

            {plcData.batteryLow && (

              <AlarmCard
                text="BATTERY LOW"
                border="border-yellow-500"
                dot="bg-yellow-400"
              />

            )}

            {plcData.shortCircuit && (

              <AlarmCard
                text="SHORT CIRCUIT DETECTED"
                border="border-red-500"
                dot="bg-red-400"
              />

            )}

            {plcData.timePreventive && (

              <AlarmCard
                text="TIME PREVENTIVE ACTIVE"
                border="border-blue-500"
                dot="bg-blue-400"
              />

            )}

          </div>

        </div>

        {/* TIMELINE */}

        <div className="xl:col-span-2 bg-[#081028] border border-[#1e293b] rounded-3xl p-6">

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-3xl font-bold">

              Realtime Event Timeline

            </h1>

            <span className="text-green-400 font-bold">

              ● LIVE

            </span>

          </div>

          <div className="space-y-5 max-h-[650px] overflow-auto">

            {timeline.map((item, index) => (

              <TimelineCard
                key={index}
                item={item}
                currentTime={currentTime}
              />

            ))}

          </div>

        </div>

      </div>

    </MainLayout>

  );
}

// =========================================
// STATUS CARD
// =========================================

function StatusCard({
  title,
  value,
  color,
  icon,
}) {

  return (

    <div className="bg-[#081028] border border-[#1e293b] rounded-3xl p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm">

            {title}

          </p>

          <h1 className={`text-5xl font-bold mt-4 ${color}`}>

            {value}

          </h1>

        </div>

        <div className="bg-[#111c36] p-4 rounded-2xl">

          {icon}

        </div>

      </div>

    </div>

  );
}

// =========================================
// DONUT CARD
// =========================================

function DonutCard({
  title,
  value,
  text,
  color,
  label,
}) {

  return (

    <div className="bg-[#081028] border border-[#1e293b] rounded-3xl p-6">

      <div className="flex justify-between items-center mb-5">

        <h1 className="font-bold text-2xl">

          {title}

        </h1>

        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />

      </div>

      <div className="w-48 h-48 mx-auto">

        <CircularProgressbar
          value={value}
          text={text}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#1e293b",
          })}
        />

      </div>

      <p
        className="text-center mt-5 font-bold text-xl"
        style={{ color }}
      >

        {label}

      </p>

    </div>

  );
}

// =========================================
// ALARM CARD
// =========================================

function AlarmCard({
  text,
  border,
  dot,
}) {

  return (

    <div className={`bg-[#111c36] border ${border} rounded-2xl p-5 flex justify-between items-center`}>

      <span className="font-bold">

        {text}

      </span>

      <div className={`w-3 h-3 rounded-full ${dot}`} />

    </div>

  );
}

// =========================================
// TIMELINE CARD
// =========================================

function TimelineCard({
  item,
  currentTime,
}) {

  return (

    <div className="bg-[#111c36] rounded-2xl p-5 border-l-4 border-green-400">

      <div className="flex justify-between mb-4">

        <h1 className="font-bold text-xl">

          PLC EVENT

        </h1>

        <span className="text-gray-400">

          {currentTime.toLocaleTimeString()}

        </span>

      </div>

      <div className="bg-[#1e293b] rounded-xl px-5 py-4 text-lg">

        {item.message}

      </div>

    </div>

  );
}