import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5204";

interface Event {
    id: string;
    title: string;
    description: string | null;
    eventDate: string;
    location: string;
    category: string;
    createdAt: string;
    imageUrl?: string | null;
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

            const fetchEvents = async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response = await fetch(
                        `${API_BASE_URL}/api/events`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            "Unable to load upcoming events."
                        );
                    }

                    const data = await response.json();

                    // Only show upcoming events
                    const upcomingEvents = data
                        .filter(
                            (event: Event) =>
                                new Date(event.eventDate) >= new Date()
                        )
                        .sort(
                            (a: Event, b: Event) =>
                                new Date(a.eventDate).getTime() -
                                new Date(b.eventDate).getTime()
                        );

                    setEvents(upcomingEvents);
                } catch (err) {
                    console.error("Error loading events:", err);

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
        } catch (err) {
            console.error("Invalid token:", err);

            localStorage.removeItem("churchPulseToken");
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("churchPulseToken");
        navigate("/");
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* HEADER */}
            <header className="border-b border-blue-100 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
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

            {/* MAIN CONTENT */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* WELCOME */}
                <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-8 text-white shadow-lg md:p-10">
                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                    <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/5" />

                    <div className="relative z-10">
                        <p className="mb-2 text-sm font-medium text-blue-100">
                            Member Portal
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Welcome, {memberName} 👋
                        </h2>

                        <p className="mt-3 max-w-2xl text-blue-100">
                            Stay connected with your church community and
                            keep up with everything happening at New
                            Philippians Church.
                        </p>
                    </div>
                </section>

                {/* QUICK ACTIONS */}
                <section className="mb-8 grid gap-5 md:grid-cols-2">

                    {/* PROFILE */}
                    <button
                        onClick={() => navigate("/profile")}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                👤
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700">
                                    My Profile
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    View and manage your member information.
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* ANNOUNCEMENTS */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                                📢
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Announcements
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Church announcements will appear here.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UPCOMING EVENTS */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

                    {/* SECTION HEADER */}
                    <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Stay Connected
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                                Upcoming Events
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                See what's happening at church.
                            </p>
                        </div>

                        {!loading && events.length > 0 && (
                            <span className="text-sm font-medium text-slate-400">
                                {events.length} upcoming{" "}
                                {events.length === 1
                                    ? "event"
                                    : "events"}
                            </span>
                        )}
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >
                                    <div className="h-64 animate-pulse bg-slate-200" />

                                    <div className="space-y-3 p-5">
                                        <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                                        <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
                                        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
                            <div className="flex gap-4">
                                <div className="text-2xl">⚠️</div>

                                <div>
                                    <h3 className="font-semibold text-red-800">
                                        Unable to load events
                                    </h3>

                                    <p className="mt-1 text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NO EVENTS */}
                    {!loading && !error && events.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                                📅
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-800">
                                No upcoming events
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                There are currently no upcoming church
                                events. Check back later for new events.
                            </p>
                        </div>
                    )}

                    {/* EVENTS */}
                    {!loading && !error && events.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((event) => (
                                <article
                                    key={event.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* EVENT IMAGE */}
                                    {event.imageUrl ? (
                                        <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-slate-100">
                                            <img
                                                src={`${API_BASE_URL}${event.imageUrl}`}
                                                alt={event.title}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50">
                                            <div className="text-center">
                                                <div className="text-5xl">
                                                    📅
                                                </div>

                                                <p className="mt-2 text-sm font-medium text-slate-500">
                                                    Church Event
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* EVENT CONTENT */}
                                    <div className="p-5">

                                        {/* CATEGORY */}
                                        <div className="mb-3">
                                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {event.category ||
                                                    "General"}
                                            </span>
                                        </div>

                                        {/* TITLE */}
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {event.title}
                                        </h3>

                                        {/* DESCRIPTION */}
                                        {event.description && (
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                                                {event.description}
                                            </p>
                                        )}

                                        {/* EVENT DETAILS */}
                                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

                                            {/* DATE */}
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg">
                                                    📅
                                                </span>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Date
                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {formatDate(
                                                            event.eventDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* TIME */}
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg">
                                                    🕐
                                                </span>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Time
                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {formatTime(
                                                            event.eventDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* LOCATION */}
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg">
                                                    📍
                                                </span>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Location
                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {event.location ||
                                                            "Main Church Auditorium"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* FOOTER */}
                <footer className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
                    <p>
                        THE NEW PHILIPPIANS CHURCH • Member Portal
                    </p>

                    <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Connected
                    </p>
                </footer>
            </main>
        </div>
    );
}