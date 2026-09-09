
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerMember } from "../services/memberService";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullNames: "",
        surname: "",
        mobileNumber: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setMessage("");

        // Check that passwords match
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        // Basic password requirement
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await registerMember({
                fullNames: formData.fullNames,
                surname: formData.surname,
                mobileNumber: formData.mobileNumber,
                dateOfBirth: formData.dateOfBirth,
                password: formData.password,
            });

            setMessage(response.message);

            // Registration successful
            // Send the member to the login page
            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
                    Member Registration
                </h1>

                <p className="mb-6 text-center text-slate-500">
                    Create your church member account.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Full Names */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Full Names
                        </label>

                        <input
                            type="text"
                            name="fullNames"
                            value={formData.fullNames}
                            onChange={handleChange}
                            placeholder="Enter your full names"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Surname */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Surname
                        </label>

                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Enter your surname"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Date of Birth
                        </label>

                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
                            {message}
                        </div>
                    )}

                    {/* Register */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already registered?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Member Login
                    </Link>
                </p>

                <p className="mt-3 text-center text-sm text-slate-500">
                    <Link
                        to="/"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Back to Welcome Page
                    </Link>
                </p>

            </div>
        </div>
    );
}
