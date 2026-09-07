import { useState } from "react";
import { registerMember } from "../services/memberService";

export default function Register() {
    const [formData, setFormData] = useState({
        fullNames: "",
        surname: "",
        mobileNumber: "",
        dateOfBirth: "",
    });

    const [message, setMessage] = useState("");

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

        try {
            const response =
                await registerMember(formData);

            setMessage(response.message);

            setFormData({
                fullNames: "",
                surname: "",
                mobileNumber: "",
                dateOfBirth: "",
            });
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
                    Member Registration
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
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

                    {message && (
                        <p className="text-center">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}