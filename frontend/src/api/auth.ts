import api from "./axiosConfig.ts"; // adjust path depending on where your axios file is

export const registerUser = (userData: RegisterRequest) => {
    return api.post("/auth/register", userData);
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    id: number;
    username: string;
    email: string;
    role: string;
}