import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/members", label: "Members", icon: "👥" },
        { path: "/events", label: "Events", icon: "📅" },
        { path: "/reports", label: "Reports", icon: "📈" },
        { path: "/settings", label: "Settings", icon: "⚙️" },
    ];

    const handleLogout = () => {
        // Clear stored auth token
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redirect directly to the welcome screen
        navigate("/");
    };

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 shadow-lg sticky top-0">
            <div>
                <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-700">
                    <span className="text-2xl">⛪</span>
                    <h1 className="text-xl font-bold tracking-wide">ChurchPulse</h1>
                </div>

                <nav className="flex flex-col gap-1" aria-label="Sidebar navigation">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                >
                    <span className="text-lg">🚪</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}