
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-blue-50">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="w-full max-w-3xl rounded-2xl bg-white p-10 text-center shadow-lg border border-blue-100">
                    
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold text-blue-700 md:text-5xl">
                            WELCOME TO THE NEW PHILIPPIANS CHURCH IN S.A
                        </h1>

                        <p className="mt-4 text-lg text-blue-500">
                            Grow together. Stay connected. Serve with purpose.
                        </p>
                    </header>

                    <div className="mx-auto flex max-w-md flex-col gap-4">
                        {/* Member Registration */}
                        <Link
                            to="/register"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            Register as a Member
                        </Link>

                        {/* Member Login */}
                        <Link
                            to="/login"
                            className="rounded-lg border border-blue-300 bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                        >
                            Member Login
                        </Link>

                        {/* Admin Login */}
                        <Link
                            to="/admin-login"
                            className="rounded-lg border border-blue-300 bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

