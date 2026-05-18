import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Factory,
  ShieldCheck,
  Activity,
  BellRing,
  Cpu,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="w-[1400px] h-[800px] rounded-[30px] overflow-hidden border border-cyan-500/20 bg-[#0b1220]/90 backdrop-blur-xl shadow-2xl flex z-10">
        {/* LEFT */}
        <div className="w-1/2 relative bg-gradient-to-br from-cyan-900/40 to-blue-950 p-12 flex flex-col justify-between">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=2070&auto=format&fit=crop')",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <Factory className="text-cyan-400" size={50} />

              <h1 className="text-5xl font-bold text-white">
                PLC MONITORING
              </h1>
            </div>

            <p className="text-gray-300 text-xl max-w-[500px]">
              Realtime industrial monitoring dashboard untuk monitoring mesin,
              PLC, alert, dan analytics.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/5 border border-cyan-500/10 rounded-2xl p-5">
              <Activity className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Realtime
              </h2>

              <p className="text-gray-400 text-sm">
                Monitoring realtime Socket.io
              </p>
            </div>

            <div className="bg-white/5 border border-cyan-500/10 rounded-2xl p-5">
              <Cpu className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Multi PLC
              </h2>

              <p className="text-gray-400 text-sm">
                Siemens, OPC UA, Modbus
              </p>
            </div>

            <div className="bg-white/5 border border-cyan-500/10 rounded-2xl p-5">
              <BellRing className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Smart Alert
              </h2>

              <p className="text-gray-400 text-sm">
                Alert realtime otomatis
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 flex items-center justify-center bg-[#050b16] p-16">
          <div className="w-full max-w-[450px]">
            <div className="mb-10">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="text-cyan-400" size={40} />
              </div>

              <h1 className="text-5xl font-bold text-white mb-3">
                Welcome Back
              </h1>

              <p className="text-gray-400">
                Login untuk masuk ke dashboard monitoring
              </p>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username"
                className="w-full h-[60px] bg-[#0d1726] border border-cyan-500/10 rounded-2xl px-5 text-white outline-none focus:border-cyan-400"
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full h-[60px] bg-[#0d1726] border border-cyan-500/10 rounded-2xl px-5 text-white outline-none focus:border-cyan-400"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                onClick={login}
                className="w-full h-[60px] rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] transition-all"
              >
                LOGIN
              </button>
            </div>

            <div className="mt-10 flex justify-between text-gray-500 text-sm">
              <span>© 2026 PLC Monitoring</span>

              <span className="text-green-400">
                ● System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}