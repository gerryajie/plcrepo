import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#020817] text-white">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}