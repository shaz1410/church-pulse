const API_URL = "http://localhost:5204/api/Members";

export async function registerMember(member: {
    fullNames: string;
    surname: string;
    mobileNumber: string;
    dateOfBirth: string;
    password: string;
}) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(member),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
    }

    return data;
}