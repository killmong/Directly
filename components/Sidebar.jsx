import { LayoutDashboard, MonitorPlay, Users, LogIn, Film } from "lucide-react";

export const Sidebar = ({ currentView, setView }) => (
  <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col z-20">
    <div className="flex items-center gap-3 mb-10">
      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
        <Film className="w-4 h-4 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">LUMINA.</span>
    </div>
    <nav className="flex-1 space-y-2">
      {[
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "portfolio", label: "Live Showcase", icon: MonitorPlay },
        { id: "community", label: "Community", icon: Users },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
            currentView === item.id
              ? "bg-orange-600 text-white shadow-md"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <item.icon className="w-5 h-5" /> {item.label}
        </button>
      ))}
    </nav>
  </aside>
);
