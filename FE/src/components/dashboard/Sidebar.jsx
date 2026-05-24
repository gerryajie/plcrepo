import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileBarChart2,
  LogOut,
  Activity
} from "lucide-react";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="hidden md:flex w-[260px] bg-[#081028] border-r border-[#1e293b] flex-col justify-between p-6">

      <div>

        <div className="flex items-center gap-3 mb-12">

          <div className="bg-green-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(0,255,100,0.4)]">
            <Activity size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              PLC SYSTEM
            </h1>

            <p className="text-gray-400 text-sm">
              Industrial Monitoring
            </p>
          </div>

        </div>

        <div className="space-y-4">

          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
              location.pathname === "/dashboard"
                ? "bg-green-600"
                : "bg-[#111c36]"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/report")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
              location.pathname === "/report"
                ? "bg-blue-600"
                : "bg-[#111c36]"
            }`}
          >
            <FileBarChart2 size={20} />
            Report
          </button>

        </div>

      </div>

      <div>

        <div className="bg-[#111c36] rounded-2xl p-5 mb-5 border border-[#1e293b]">

          <p className="text-gray-400 text-sm mb-1">
            Logged in as
          </p>

          <h2 className="text-xl font-bold text-green-400">
            {user?.username || "Operator"}
          </h2>

        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}