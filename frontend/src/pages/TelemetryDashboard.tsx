import "../assets/CSS/telemetry/TelemetryDashboard.css";
import MetricCard from "../components/telemetry/MetricCard";
import { useEffect, useState } from "react";
import {
    getApiPerformanceMetrics,
    getTelemetryMetrics,
    getApiHealthMetrics,
    getSlowRequests
} from "../services/telemetryService";
import type {
    ApiHealthMetric,
    ApiPerformanceMetric,
    TelemetryMetrics
} from "../services/telemetryService";
import FeatureUsageChart from "../components/telemetry/FeatureUsageChart";
import EndpointAnalyticsTable from "../components/telemetry/EndpointAnalyticsTable";
import SlowRequestsTable from "../components/telemetry/SlowRequestTable";
import type { SlowRequestMetric } from "../services/telemetryService";


export default function TelemetryDashboard() {

    const [metrics, setMetrics] = useState<TelemetryMetrics>({
        totalUsers: 0,
        totalActiveUsers: 0,
        totalProjectsCreated: 0,
        totalWikiPagesCreated: 0,
        totalAIRequests: 0
    });

    const [days, setDays] = useState<number>(7);

    const [apiPerformanceMetrics, setApiPerformanceMetrics] =
        useState<ApiPerformanceMetric[]>([]);

    const [apiHealthMetrics, setApiHealthMetrics] =
        useState<ApiHealthMetric[]>([]);

    const [slowRequests, setSlowRequests] =
    useState<SlowRequestMetric[]>([]);

    const [slowRequestPage, setSlowRequestPage] =
        useState(0);

    const [slowRequestTotalPages, setSlowRequestTotalPages] =
        useState(0);


    useEffect(() => {

        async function loadMetrics() {

            const data = await getTelemetryMetrics();

            setMetrics(data);
        }


        async function loadApiPerformanceMetrics() {

            const data = await getApiPerformanceMetrics(days);

            console.log("API Performance Metrics:", data);

            setApiPerformanceMetrics(data);
        }


        async function loadApiHealthMetrics() {

            const data = await getApiHealthMetrics(days);

            console.log("API Health Metrics:", data);

            setApiHealthMetrics(data);
        }

        async function loadSlowRequests() {

            const data = await getSlowRequests(
                slowRequestPage,
                5
            );

            setSlowRequests(data.content);

            setSlowRequestTotalPages(data.totalPages);
            console.log("Slow Requests:", data.content);

        }


        loadMetrics();
        loadApiPerformanceMetrics();
        loadApiHealthMetrics();
        loadSlowRequests();

    }, [days, slowRequestPage]);


    const featureUsage = [
        {
            name: "AI Requests",
            value: metrics.totalAIRequests
        },
        {
            name: "Wiki Pages",
            value: metrics.totalWikiPagesCreated
        },
        {
            name: "Projects",
            value: metrics.totalProjectsCreated
        },
        {
            name: "Logins",
            value: metrics.totalActiveUsers
        }
    ];


    const endpointMetrics = apiPerformanceMetrics.map(performance => {

        const health = apiHealthMetrics.find(
            h =>
                h.endpoint === performance.endpoint &&
                h.httpMethod === performance.method
        );


        return {
            endpoint: performance.endpoint,
            httpMethod: performance.method,

            totalRequests: health?.totalRequests ?? 0,
            successfulRequests: health?.successfulRequests ?? 0,
            clientErrors: health?.clientErrors ?? 0,
            serverErrors: health?.serverErrors ?? 0,

            averageResponseTime: performance.averageResponseTime,
            maxResponseTime: performance.maxResponseTime,
            minResponseTime: performance.minResponseTime,

            errorRate: health?.errorRate ?? 0
        };
    });


    return (
        <div className="telemetry-dashboard">

            <h1>Telemetry Dashboard</h1>


            <div className="metric-grid">

                <MetricCard
                    title="Total Users"
                    value={metrics.totalUsers}
                />

                <MetricCard
                    title="Daily Active Users"
                    value={metrics.totalActiveUsers}
                />

                <MetricCard
                    title="Total Projects Created"
                    value={metrics.totalProjectsCreated}
                />

                <MetricCard
                    title="Total Wiki Pages Created"
                    value={metrics.totalWikiPagesCreated}
                />

                <MetricCard
                    title="Total AI Requests"
                    value={metrics.totalAIRequests}
                />

            </div>


            <div>
                <FeatureUsageChart data={featureUsage}/>
            </div>


            


            <div className="dashboard-section">
                <div className="time-filter">

                    <label>
                        Time Range:
                    </label>


                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                    >

                        <option value={1}>
                            Today
                        </option>

                        <option value={7}>
                            Last 7 Days
                        </option>

                        <option value={30}>
                            Last 30 Days
                        </option>

                    </select>

                </div>
                <EndpointAnalyticsTable
                    metrics={endpointMetrics}
                />

            </div>


            <div className="dashboard-section">

                <SlowRequestsTable
                    requests={slowRequests}
                    page={slowRequestPage}
                    totalPages={slowRequestTotalPages}
                    setPage={setSlowRequestPage}
                />

            </div>


        </div>
    );
}