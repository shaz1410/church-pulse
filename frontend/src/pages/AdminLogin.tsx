import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5204/api/Auth/admin-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }

            localStorage.setItem("churchPulseToken", data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to login."
            );
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-blue-100">

                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Admin Login
                </h1>

                <p className="mt-2 text-center text-gray-500">
                    Sign in to manage the church
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Admin email"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Login as Admin
                    </button>

                </form>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-5 w-full text-sm text-blue-600 hover:underline"
                >
                    Back to Welcome Page
                </button>

            </div>
        </div>
    );
}