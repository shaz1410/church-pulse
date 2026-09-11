
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    // Get logged-in admin name from localStorage/JWT-related user data
    const storedUser = localStorage.getItem("user");

    let adminName = "Administrator";

    try {
        if (storedUser) {
            const user = JSON.parse(storedUser);
            adminName =
                user.fullName ||
                user.name ||
                user.username ||
                "Administrator";
        }
    } catch {
        adminName = "Administrator";
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 p-6 md:p-8 lg:p-10">

                {/* Welcome Header */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-8 md:p-10 text-white shadow-xl mb-8">

                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                    <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

                    <div className="relative z-10 max-w-3xl">
                        <p className="text-blue-100 text-sm font-medium mb-2">
                            Church Administration
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            Welcome, {adminName} 👋
                        </h1>

                        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
                            THE NEW PHILIPPIANS CHURCH DASHBOARD
                        </h2>

                        <p className="text-blue-100 max-w-2xl">
                            Manage your church community, members, events and
                            announcements from one central dashboard.
                        </p>
                    </div>
                </section>


                {/* Dashboard Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                    {/* Members */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Members
                                </p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    0
                                </p>
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                    Church community
                                </p>
                            </div>

                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                                👥
                            </div>
                        </div>
                    </div>


                    {/* New Members */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    New Members
                                </p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    0
                                </p>
                                <p className="text-xs text-emerald-600 mt-2 font-medium">
                                    Recent registrations
                                </p>
                            </div>

                            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
                                ✨
                            </div>
                        </div>
                    </div>


                    {/* Active Members */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Active Members
                                </p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    0
                                </p>
                                <p className="text-xs text-indigo-600 mt-2 font-medium">
                                    Currently active
                                </p>
                            </div>

                            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                                ✓
                            </div>
                        </div>
                    </div>


                    {/* Visitors */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Visitors
                                </p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    0
                                </p>
                                <p className="text-xs text-sky-600 mt-2 font-medium">
                                    Church visitors
                                </p>
                            </div>

                            <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-xl">
                                🤝
                            </div>
                        </div>
                    </div>

                </section>


                {/* Main Dashboard */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Quick Actions */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Quick Actions
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Common administration tasks
                            </p>
                        </div>

                        <div className="space-y-3">

                            <Link
                                to="/register"
                                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                            >
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    +
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">
                                        Register Member
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Add a new church member
                                    </p>
                                </div>

                                <span className="text-slate-400 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>


                            <Link
                                to="/members"
                                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                            >
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    👥
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">
                                        View Members
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Manage your church members
                                    </p>
                                </div>

                                <span className="text-slate-400 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>


                            <Link
                                to="/events"
                                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                            >
                                <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                    📅
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">
                                        Manage Events
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Create and manage church events
                                    </p>
                                </div>

                                <span className="text-slate-400 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>


                            <Link
                                to="/reports"
                                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                            >
                                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                                    📊
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">
                                        Generate Reports
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        View church statistics and reports
                                    </p>
                                </div>

                                <span className="text-slate-400 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>

                        </div>
                    </section>


                    {/* Recent Registrations */}
                    <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Registrations
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Recently registered church members
                                </p>
                            </div>

                            <Link
                                to="/members"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                View all →
                            </Link>
                        </div>


                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-14 text-center">

                            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-4">
                                👥
                            </div>

                            <h3 className="font-semibold text-slate-800">
                                No recent registrations
                            </h3>

                            <p className="text-sm text-slate-500 mt-1 max-w-sm">
                                New member registrations will appear here once
                                members start joining the church.
                            </p>

                            <Link
                                to="/register"
                                className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                            >
                                Register a Member
                            </Link>

                        </div>
                    </section>

                </div>


                {/* Footer Status */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <p>
                        THE NEW PHILIPPIANS CHURCH • Administration Portal
                    </p>

                    <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        System online
                    </p>
                </div>

            </main>
        </div>
    );
}

