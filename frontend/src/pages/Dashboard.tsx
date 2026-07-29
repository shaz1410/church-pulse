export default function Dashboard() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="rounded-xl bg-white p-10 shadow-lg">
                <h1 className="text-4xl font-bold text-blue-600">
                    Welcome to ChurchPulse
                </h1>

                <p className="mt-3 text-gray-600">
                    You are successfully logged in.
                </p>
            </div>
        </div>
    );
}