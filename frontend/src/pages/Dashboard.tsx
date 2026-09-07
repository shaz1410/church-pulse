export default function Dashboard() {
    const stats = [
        {
            title: "Total Members",
            value: 325,
            icon: "👥",
        },
        {
            title: "New Members",
            value: 16,
            icon: "➕",
        },
        {
            title: "Active Members",
            value: 289,
            icon: "✅",
        },
        {
            title: "Visitors",
            value: 20,
            icon: "🙋",
        },
    ];

    const recentMembers = [
        {
            name: "Sarah Mthembu",
            date: "Today",
        },
        {
            name: "John Smith",
            date: "Yesterday",
        },
        {
            name: "Nomusa Dlamini",
            date: "12 Aug 2026",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="mb-8 text-4xl font-bold text-slate-800">
                Church Dashboard
            </h1>

            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-xl bg-white p-6 shadow"
                    >
                        <div className="text-3xl">{stat.icon}</div>

                        <h2 className="mt-4 text-sm text-slate-500">
                            {stat.title}
                        </h2>

                        <p className="text-3xl font-bold">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="space-y-3">
                        <button className="w-full rounded-lg border p-3 text-left">
                            ➕ Register a Member
                        </button>

                        <button className="w-full rounded-lg border p-3 text-left">
                            👥 View Members
                        </button>

                        <button className="w-full rounded-lg border p-3 text-left">
                            📊 Generate Reports
                        </button>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">
                        Recent Registrations
                    </h2>

                    <div className="space-y-4">
                        {recentMembers.map((member) => (
                            <div
                                key={member.name}
                                className="flex items-center justify-between border-b pb-3"
                            >
                                <span>{member.name}</span>

                                <span className="text-sm text-slate-500">
                                    {member.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}