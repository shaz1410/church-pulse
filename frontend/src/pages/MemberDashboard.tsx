import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    description: string;
    eventDate: string;
}

export default function MemberDashboard() {
    const navigate = useNavigate();

    const [memberName, setMemberName] = useState("Member");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("churchPulseToken");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            // Read the actual role claim from the JWT
            const role =
                payload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];

            // Only members can access this dashboard
            if (role !== "Member") {
                navigate("/dashboard");
                return;
            }

            // Read the actual member name claim from the JWT
            const name =
                payload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ];

            setMemberName(name || "Member");
        } catch {
            localStorage.removeItem("churchPulseToken");
            navigate("/login");
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5204/api/member-events",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load upcoming events.");
                }

                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load events."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("churchPulseToken");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-blue-50">
            {/* Header */}
            <header className="border-b border-blue-100 bg-white shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-700">
                            New Philippians Church
                        </h1>

                        <p className="text-sm text-slate-500">
                            Member Portal
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-6 py-10">

                {/* Welcome */}
                <section className="mb-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-blue-700">
                        Welcome, {memberName}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Stay connected with everything happening at church.
                    </p>
                </section>

                {/* Quick Actions */}
                <section className="mb-8 grid gap-4 md:grid-cols-2">

                    {/* Profile */}
                    <button
                        onClick={() => navigate("/profile")}
                        className="rounded-xl border border-blue-100 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
                    >
                        <h3 className="text-lg font-bold text-blue-700">
                            Member Profile
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            View and manage your member information.
                        </p>
                    </button>

                    {/* Announcements */}
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-blue-700">
                            Announcements
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Church announcements will appear here.
                        </p>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-blue-700">
                            Upcoming Events
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            See what's happening at church.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <p className="text-slate-500">
                            Loading upcoming events...
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* No Events */}
                    {!loading && !error && events.length === 0 && (
                        <div className="rounded-lg bg-blue-50 p-6 text-center">
                            <p className="font-medium text-blue-700">
                                No upcoming events
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                New church events will appear here.
                            </p>
                        </div>
                    )}

                    {/* Events */}
                    {!loading && !error && events.length > 0 && (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-xl border border-blue-100 p-5"
                                >
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {event.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {event.description}
                                    </p>

                                    <p className="mt-3 text-sm font-semibold text-blue-600">
                                        {new Date(
                                            event.eventDate
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}