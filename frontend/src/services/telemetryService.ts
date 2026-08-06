import api from "../api/axiosConfig";


export interface TelemetryMetrics {
    totalUsers: number;
    totalActiveUsers: number;
    totalProjectsCreated: number;
    totalWikiPagesCreated: number;
    totalAIRequests: number;
}

export interface ApiPerformanceMetric {
    endpoint: string;
    method: string;
    requestCount: number;
    averageResponseTime: number; // in milliseconds
    maxResponseTime: number; // in milliseconds
    minResponseTime: number; // in milliseconds
}


export async function getTelemetryMetrics(): Promise<TelemetryMetrics> {

    const response = await api.get("/telemetry/dashboard");

    return response.data;
}

export async function getApiPerformanceMetrics(): Promise<ApiPerformanceMetric[]> {
    const response = await api.get("/telemetry/api-performance");

    return response.data;
}