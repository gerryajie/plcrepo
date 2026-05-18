import { useEffect, useState } from "react";

import socket from "../socket/socket";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import MachineCard from "../components/MachineCard";
import ProductionChart from "../components/ProductionChart";
import AlertPanel from "../components/AlertPanel";

export default function Dashboard() {
  const [machines, setMachines] = useState(
    {}
  );

  const [chartData, setChartData] = useState(
    []
  );

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("plc:data", (data) => {
      setMachines((prev) => ({
        ...prev,
        [data.machineId]: data,
      }));

      setChartData((prev) => [
        ...prev.slice(-20),
        {
          time:
            new Date().toLocaleTimeString(),
          temperature: data.temperature,
        },
      ]);
    });

    socket.on("alert", (alert) => {
      setAlerts((prev) => [
        alert,
        ...prev,
      ]);
    });

    return () => {
      socket.off("plc:data");
      socket.off("alert");
    };
  }, []);

  const machineList =
    Object.values(machines);

  const latest =
    machineList[0] || {};

  return (
    <div className="flex bg-[#060816] min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white">
              Smart Factory Monitoring
            </h1>

            <p className="text-gray-400">
              Multi PLC Realtime Monitoring
              Dashboard
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-5 mb-5">
            <StatCard
              title="Temperature"
              value={latest.temperature || 0}
              unit="°C"
            />

            <StatCard
              title="Pressure"
              value={latest.pressure || 0}
              unit="BAR"
            />

            <StatCard
              title="RPM"
              value={latest.rpm || 0}
              unit="RPM"
            />

            <StatCard
              title="Output"
              value={latest.output || 0}
              unit="PCS"
            />
          </div>

          {/* MAIN */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="col-span-2">
              <ProductionChart
                data={chartData}
              />
            </div>

            <AlertPanel alerts={alerts} />
          </div>

          {/* PLC STATUS */}
          <div className="mb-5">
            <h1 className="text-3xl text-white font-bold mb-4">
              PLC Machines
            </h1>

            <div className="grid grid-cols-3 gap-5">
              {machineList.map(
                (machine, index) => (
                  <MachineCard
                    key={index}
                    machine={machine}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}