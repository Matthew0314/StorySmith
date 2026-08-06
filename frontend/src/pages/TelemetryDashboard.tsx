import "../assets/CSS/telemetry/TelemetryDashboard.css";
import MetricCard from "../components/telemetry/MetricCard";
import { useEffect, useState } from "react";
import { getApiPerformanceMetrics, getTelemetryMetrics } from "../services/telemetryService";
import type { TelemetryMetrics } from "../services/telemetryService";
import FeatureUsageChart from "../components/telemetry/FeatureUsageChart";
import ApiPerformanceTable from "../components/telemetry/ApiPerformanceTable";


export default function TelemetryDashboard() {
    const [metrics, setMetrics] = useState<TelemetryMetrics>({
        totalUsers: 0,
        totalActiveUsers: 0,
        totalProjectsCreated: 0,
        totalWikiPagesCreated: 0,
        totalAIRequests: 0
    });

    useEffect(() => {

        async function loadMetrics() {

            const data = await getTelemetryMetrics();

            setMetrics(data);
        }

        async function loadApiPerformanceMetrics() {
            const data = await getApiPerformanceMetrics();
            console.log("API Performance Metrics:", data);
        }


        loadMetrics();
        loadApiPerformanceMetrics();

    }, []);

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


    return (
        <div className="telemetry-dashboard">
            <h1>Telemetry Dashboard</h1>


            <div className="metric-grid">
                <MetricCard title="Total Users" value={metrics?.totalUsers ?? 0} />
                <MetricCard title="Daily Active Users" value={metrics?.totalActiveUsers ?? 0} />
                <MetricCard title="Total Projects Created" value={metrics?.totalProjectsCreated ?? 0} />
                <MetricCard title="Total Wiki Pages Created" value={metrics?.totalWikiPagesCreated ?? 0} />
                <MetricCard title="Total AI Requests" value={metrics?.totalAIRequests ?? 0} />
            </div>

            <div>
                <FeatureUsageChart data={featureUsage}/>
            </div>

            <div>
                <ApiPerformanceTable />
            </div>
        </div>
    );

    

}