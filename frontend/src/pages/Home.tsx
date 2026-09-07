import { Link } from "react-router-dom";

export default function Home() {
    const announcements = [
        "Prayer meeting on Friday at 18:00",
        "Youth conference registration is now open",
    ];

    const events = [
        {
            title: "Women's Fellowship",
            date: "22 August 2026",
        },
        {
            title: "Youth Service",
            date: "29 August 2026",
        },
    ];

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-bold text-blue-700">
                        The New Phillipian Church In S.A
                    </h1>

                    <p className="mt-4 text-lg text-blue-500">
                        Grow together. Stay connected. Serve with purpose.
                    </p>
                </header>

                <section className="mb-8 rounded-xl bg-white p-8 shadow border border-blue-100">
                    <h2 className="mb-4 text-2xl font-semibold text-blue-800">
                        Church Announcements
                    </h2>

                    <ul className="space-y-3">
                        {announcements.map((announcement, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-700">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                {announcement}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8 rounded-xl bg-white p-8 shadow border border-blue-100">
                    <h2 className="mb-4 text-2xl font-semibold text-blue-800">
                        Upcoming Events
                    </h2>

                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.title}
                                className="flex items-center justify-between border-b border-blue-100 pb-3"
                            >
                                <span className="text-slate-700">{event.title}</span>

                                <span className="text-blue-500">
                                    {event.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/register"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        Register as a Member
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-lg border border-blue-300 bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
}