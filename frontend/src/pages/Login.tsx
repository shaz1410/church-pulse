import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../services/authService";

type LoginForm = {
    email: string;
    password: string;
};

export default function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>();

    async function onSubmit(data: LoginForm) {
        try {
            await login(data);

            toast.success("Login successful!");

            navigate("/dashboard");
        } catch {
            toast.error("Invalid email or password.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
                    ChurchPulse
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="mb-2 block">Email</label>

                        <input
                            type="email"
                            className="w-full rounded-lg border p-3"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block">Password</label>

                        <input
                            type="password"
                            className="w-full rounded-lg border p-3"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}