import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";

interface ChurchEvent {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    category: string;
    createdAt: string;
}

export default function Events() {
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Form state using the ChurchEvent interface
    const [newEvent, setNewEvent] = useState<Omit<ChurchEvent, "id" | "createdAt">>({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        category: "Worship Service",
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch existing events from the backend wrapped in useCallback
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5204/api/events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to load events");

            const data: ChurchEvent[] = await response.json();
            setEvents(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchEvents();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchEvents]);

    // Handle creation of a new event
   const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");

        // Convert datetime-local value to ISO 8601 string expected by .NET
        const formattedPayload = {
            ...newEvent,
            eventDate: new Date(newEvent.eventDate).toISOString(),
        };

        const response = await fetch("http://localhost:5204/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedPayload),
        });

        if (!response.ok) {
            // Read detail from backend error response
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || errorData?.title || `HTTP Error ${response.status}`;
            throw new Error(errorMessage);
        }

        // Refresh list on success
        const res = await fetch("http://localhost:5204/api/events", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const updatedEvents: ChurchEvent[] = await res.json();
            setEvents(updatedEvents);
        }

        setIsModalOpen(false);
        setNewEvent({
            title: "",
            description: "",
            eventDate: "",
            location: "",
            category: "Worship Service",
        });
    } catch (err) {
        const errorObj = err as Error;
        alert(`Error: ${errorObj.message}`);
    }
};

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Events Management</h1>
                        <p className="text-slate-500 text-sm">Schedule and manage upcoming church services and gatherings</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        + Create New Event
                    </button>
                </div>

                {/* Event Cards Grid */}
                {loading ? (
                    <p className="text-slate-500">Loading events...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((evt) => (
                            <div key={evt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                                    {evt.category}
                                </span>
                                <h2 className="text-lg font-semibold text-slate-800 mb-2">{evt.title}</h2>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{evt.description || "No description provided."}</p>
                                <div className="text-xs text-slate-500 space-y-1">
                                    <p>📅 {new Date(evt.eventDate).toLocaleDateString()}</p>
                                    <p>📍 {evt.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Event Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="Worship Service">Worship Service</option>
                                        <option value="Bible Study">Bible Study</option>
                                        <option value="Youth Gathering">Youth Gathering</option>
                                        <option value="Community Outreach">Community Outreach</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={newEvent.eventDate}
                                        onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border text-sm rounded-lg hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                                    >
                                        Save Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}