import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* 1. Add Sidebar to left side of Dashboard */}
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Church Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
                        <span className="text-2xl bg-purple-100 p-3 rounded-lg">👥</span>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Total Members</p>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
                        <span className="text-2xl bg-amber-100 p-3 rounded-lg">✨</span>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">New Members</p>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
                        <span className="text-2xl bg-orange-100 p-3 rounded-lg">⚡</span>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Active Members</p>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
                        <span className="text-2xl bg-yellow-100 p-3 rounded-lg">🤝</span>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Visitors</p>
                            <p className="text-2xl font-bold text-slate-800">0</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Quick Actions Column */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-3">
                            <Link to="/register" className="p-3 border rounded-lg hover:bg-slate-50 flex items-center gap-3 font-medium text-slate-700">
                                <span>➕</span> Register a Member
                            </Link>
                            <Link to="/members" className="p-3 border rounded-lg hover:bg-slate-50 flex items-center gap-3 font-medium text-slate-700">
                                <span>👥</span> View Members
                            </Link>
                            {/* 2. Added Manage Events Quick Action */}
                            <Link to="/events" className="p-3 border rounded-lg hover:bg-slate-50 flex items-center gap-3 font-medium text-slate-700">
                                <span>📅</span> Manage Events
                            </Link>
                            <Link to="/reports" className="p-3 border rounded-lg hover:bg-slate-50 flex items-center gap-3 font-medium text-slate-700">
                                <span>📊</span> Generate Reports
                            </Link>
                        </div>
                    </div>

                    {/* Recent Registrations Column */}
                    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Registrations</h2>
                        <p className="text-slate-500 text-sm">No recent member registrations found.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}