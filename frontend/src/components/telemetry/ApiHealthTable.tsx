import { useEffect, useState } from "react";
import { getApiHealthMetrics } from "../../services/telemetryService";
import type { ApiHealthMetric } from "../../services/telemetryService";

interface ApiHealthTableProps {
    days: number;
}

export default function ApiHealthTable({ days }: ApiHealthTableProps) {

    const [metrics, setMetrics] = useState<ApiHealthMetric[]>([]);

    useEffect(() => {
        async function loadMetrics() {
            const data = await getApiHealthMetrics(days);
            console.log("API Health Metrics:", data);
            setMetrics(data);
        }

        loadMetrics();
    }, [days]);

    return (
        <div>
            <h2>API Health</h2>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Requests</th>
                        <th>Success</th>
                        <th>4xx</th>
                        <th>5xx</th>
                        <th>Error Rate</th>
                    </tr>
                </thead>

                <tbody>
                    {[...metrics]
                        .sort((a, b) => b.errorRate - a.errorRate)
                        .map(metric => (
                            <tr key={`${metric.httpMethod}-${metric.endpoint}`}>
                                <td>{metric.httpMethod}</td>
                                <td>{metric.endpoint}</td>
                                <td>{metric.totalRequests}</td>
                                <td>{metric.successfulRequests}</td>
                                <td>{metric.clientErrors}</td>
                                <td>{metric.serverErrors}</td>
                                <td className={
                                    metric.errorRate >= 10
                                        ? "text-red-600 font-bold"
                                        : metric.errorRate >= 5
                                        ? "text-yellow-600 font-semibold"
                                        : "text-green-600"
                                }>{metric.errorRate.toFixed(1)}%</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}