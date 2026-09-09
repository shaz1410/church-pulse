
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5204/api/Auth/member-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mobileNumber,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid mobile number or password."
                );
            }

            // Save the JWT token
            localStorage.setItem("churchPulseToken", data.token);

            // Redirect to the member dashboard
            navigate("/dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
                    Member Login
                </h1>

                <p className="mb-6 text-center text-slate-500">
                    Login with your registered mobile number and password.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Mobile Number */}
                    <div>
                        <label className="mb-1 block font-medium text-slate-700">
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) =>
                                setMobileNumber(e.target.value)
                            }
                            placeholder="Enter your mobile number"
                            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 space-y-3 text-center text-sm text-slate-500">

                    <p>
                        Not registered yet?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Register as a Member
                        </Link>
                    </p>

                    <p>
                        <Link
                            to="/"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Back to Welcome Page
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

