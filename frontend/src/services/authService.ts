import api from "../api/axios";

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    role: string;
}

export async function login(data: LoginDto) {
    const response = await api.post("/Auth/login", data);

    localStorage.setItem("token", response.data.token);

    return response.data;
}

export async function register(data: RegisterDto) {
    const response = await api.post("/Auth/register", data);
    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}