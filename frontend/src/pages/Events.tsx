import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = "http://localhost:5204";

interface ChurchEvent {
    id: string;
    title: string;
    description?: string | null;
    eventDate: string;
    location: string;
    category: string;
    createdAt: string;
    imageUrl?: string | null;
}

interface EventFormData {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    category: string;
}

export default function Events() {
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

    const [newEvent, setNewEvent] = useState<EventFormData>({
        title: "",
        description: "",
        eventDate: "",
        location: "Main Church Auditorium",
        category: "General",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
        null
    );
    const [imageError, setImageError] = useState("");

    const token = localStorage.getItem("churchPulseToken");

    // --------------------------------------------------
    // FETCH EVENTS
    // --------------------------------------------------

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/api/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch events.");
            }

            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // --------------------------------------------------
    // FORM HANDLERS
    // --------------------------------------------------

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setNewEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------
    // IMAGE HANDLING
    // --------------------------------------------------

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setImageError("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setImageError(
                "Only JPG, JPEG, PNG and WebP images are allowed."
            );

            e.target.value = "";
            return;
        }

        if (file.size > maxSize) {
            setImageError("Image size must not exceed 5 MB.");

            e.target.value = "";
            return;
        }

        setSelectedImage(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setImageError("");
    };

    // --------------------------------------------------
    // OPEN CREATE MODAL
    // --------------------------------------------------

    const openCreateModal = () => {
        setEditingEvent(null);

        setNewEvent({
            title: "",
            description: "",
            eventDate: "",
            location: "Main Church Auditorium",
            category: "General",
        });

        setSelectedImage(null);
        setImagePreview(null);
        setExistingImageUrl(null);
        setImageError("");

        setShowModal(true);
    };

    // --------------------------------------------------
    // OPEN EDIT MODAL
    // --------------------------------------------------

    const openEditModal = (event: ChurchEvent) => {
        setEditingEvent(event);

        const formattedDate = event.eventDate
            ? new Date(event.eventDate)
                  .toISOString()
                  .slice(0, 16)
            : "";

        setNewEvent({
            title: event.title,
            description: event.description || "",
            eventDate: formattedDate,
            location: event.location,
            category: event.category,
        });

        setSelectedImage(null);
        setImagePreview(null);
        setExistingImageUrl(event.imageUrl || null);
        setImageError("");

        setShowModal(true);
    };

    // --------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingEvent(null);
        setSelectedImage(null);
        setImagePreview(null);
        setExistingImageUrl(null);
        setImageError("");
    };

    // --------------------------------------------------
    // CREATE / UPDATE EVENT
    // --------------------------------------------------

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSaving(true);
        setImageError("");

        try {
            const formData = new FormData();

            formData.append("Title", newEvent.title);
            formData.append("Description", newEvent.description);
            formData.append(
                "EventDate",
                new Date(newEvent.eventDate).toISOString()
            );
            formData.append("Location", newEvent.location);
            formData.append("Category", newEvent.category);

            if (selectedImage) {
                formData.append("Image", selectedImage);
            }

            let response: Response;

            if (editingEvent) {
                response = await fetch(
                    `${API_BASE_URL}/api/events/${editingEvent.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            } else {
                response = await fetch(
                    `${API_BASE_URL}/api/events`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            }

            if (!response.ok) {
                const errorText = await response.text();

                console.error("Server error:", errorText);

                throw new Error(
                    editingEvent
                        ? "Failed to update event."
                        : "Failed to create event."
                );
            }

            await fetchEvents();
            closeModal();
        } catch (error) {
            console.error("Error saving event:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // DELETE EVENT
    // --------------------------------------------------

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/events/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete event.");
            }

            await fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    // --------------------------------------------------
    // FORMAT DATE
    // --------------------------------------------------

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 p-6 md:p-8">
                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Church Events
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Manage upcoming church events and activities.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        <span className="text-xl">+</span>
                        Add Event
                    </button>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="text-slate-500">
                            Loading events...
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl">
                            📅
                        </div>

                        <h2 className="text-xl font-semibold text-slate-800">
                            No events yet
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Create your first church event to get started.
                        </p>

                        <button
                            onClick={openCreateModal}
                            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                        >
                            Create Event
                        </button>
                    </div>
                ) : (
                    /* EVENTS GRID */
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {events.map((evt) => (
                            <div
                                key={evt.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* EVENT IMAGE */}
                                {evt.imageUrl ? (
                                    <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-slate-100">
                                        <img
                                            src={`${API_BASE_URL}${evt.imageUrl}`}
                                            alt={evt.title}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-indigo-50">
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
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                            {evt.category}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-800">
                                        {evt.title}
                                    </h2>

                                    {evt.description && (
                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                                            {evt.description}
                                        </p>
                                    )}

                                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                📅
                                            </span>

                                            <span>
                                                {formatDate(
                                                    evt.eventDate
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                🕐
                                            </span>

                                            <span>
                                                {formatTime(
                                                    evt.eventDate
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                📍
                                            </span>

                                            <span>
                                                {evt.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
                                        <button
                                            onClick={() =>
                                                openEditModal(evt)
                                            }
                                            className="flex-1 rounded-lg border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(evt.id)
                                            }
                                            className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ==================================================
                CREATE / EDIT MODAL
            ================================================== */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {editingEvent
                                        ? "Edit Event"
                                        : "Create Event"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editingEvent
                                        ? "Update the event details below."
                                        : "Add a new church event."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            {/* TITLE */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Event Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={150}
                                    placeholder="e.g. Sunday Worship Service"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={newEvent.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="General">
                                        General
                                    </option>

                                    <option value="Worship">
                                        Worship
                                    </option>

                                    <option value="Youth">
                                        Youth
                                    </option>

                                    <option value="Prayer">
                                        Prayer
                                    </option>

                                    <option value="Bible Study">
                                        Bible Study
                                    </option>

                                    <option value="Conference">
                                        Conference
                                    </option>

                                    <option value="Outreach">
                                        Outreach
                                    </option>

                                    <option value="Fundraising">
                                        Fundraising
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* DATE */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="eventDate"
                                    value={newEvent.eventDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* LOCATION */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    placeholder="Main Church Auditorium"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Describe the event..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* IMAGE UPLOAD */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Event Image / Poster
                                </label>

                                <p className="mb-3 text-xs text-slate-500">
                                    JPG, JPEG, PNG or WebP. Maximum size:
                                    5 MB.
                                </p>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                />

                                {/* IMAGE ERROR */}
                                {imageError && (
                                    <p className="mt-2 text-sm font-medium text-red-600">
                                        {imageError}
                                    </p>
                                )}

                                {/* IMAGE PREVIEW */}
                                {(imagePreview || existingImageUrl) && (
                                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <div className="flex h-72 w-full items-center justify-center">
                                            <img
                                                src={
                                                    imagePreview ||
                                                    `${API_BASE_URL}${existingImageUrl}`
                                                }
                                                alt="Event preview"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div className="border-t border-slate-200 bg-white p-3">
                                            <button
                                                type="button"
                                                onClick={
                                                    removeSelectedImage
                                                }
                                                className="text-sm font-semibold text-red-600 hover:text-red-700"
                                            >
                                                Remove selected image
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FORM ACTIONS */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingEvent
                                        ? "Update Event"
                                        : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}