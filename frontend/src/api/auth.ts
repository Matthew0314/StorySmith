import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const registerUser = (userData: RegisterRequest) => {
    return axios.post(`${API}/register`, userData);
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axios.post(`${API}/login`, data);
    return res.data;
};

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
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