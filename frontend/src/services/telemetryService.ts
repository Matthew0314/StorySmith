import api from "../api/axiosConfig";


export interface SlowRequestMetric {
    endpoint: string;
    httpMethod: string;
    responseTimeMs: number;
    statusCode: number;
    timestamp: string;
}


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

export interface ApiHealthMetric {
    endpoint: string;
    httpMethod: string;
    totalRequests: number;
    successfulRequests: number;
    clientErrors: number;
    serverErrors: number;
    errorRate: number;
}

export interface EndpointMetric {
    endpoint: string;
    httpMethod: string;

    totalRequests: number;

    averageResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;

    errorRate: number;
    serverErrors: number;
}

export interface SlowRequestResponse {
    content: SlowRequestMetric[];
    totalPages: number;
    totalElements: number;
}


export async function getTelemetryMetrics(): Promise<TelemetryMetrics> {

    const response = await api.get("/telemetry/dashboard");

    return response.data;
}

export async function getApiPerformanceMetrics(days: number = 7): Promise<ApiPerformanceMetric[]> {
    const response = await api.get(`/telemetry/api-performance?days=${days}`);

    return response.data;
}

export async function getSlowRequests(
    page: number,
    size: number
): Promise<SlowRequestResponse> {
    const response = await api.get(`/telemetry/slow-requests?page=${page}&size=${size}`);
    console.log("Slow Requests Response:", response.data);

    return response.data;
}

export async function getApiHealthMetrics(days: number = 7): Promise<ApiHealthMetric[]> {
    const response = await api.get(`/telemetry/api-health?days=${days}`);

    return response.data;
}
