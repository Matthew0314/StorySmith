import { useEffect, useState } from "react";
import { getApiPerformanceMetrics } from "../../services/telemetryService";
import type { ApiPerformanceMetric } from "../../services/telemetryService";

interface ApiPerformanceTableProps {
    days: number;
}
export default function ApiPerformanceTable({ days }: ApiPerformanceTableProps) {

    const [metrics, setMetrics] = useState<ApiPerformanceMetric[]>([]);


    useEffect(() => {
        loadMetrics();
    }, [days]);


    async function loadMetrics() {
        const data = await getApiPerformanceMetrics(days);
        setMetrics(data);
    }

    function getPerformanceClass(time: number) {
        if (time > 100) {
            return "slow";
        }

        if (time > 500) {
            return "warning";
        }

        return "normal";
    }


    return (
        <div>
            <h2>API Performance</h2>

            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Requests</th>
                        <th>Average</th>
                        <th>Min</th>
                        <th>Max</th>
                    </tr>
                </thead>

                <tbody>
                    {[...metrics].sort((a, b) => b.averageResponseTime - a.averageResponseTime).map((metric) => (
                        <tr className={getPerformanceClass(metric.averageResponseTime)} key={metric.endpoint + metric.method}>
                            <td>{metric.method}</td>
                            <td>{metric.endpoint}</td>
                            <td>{metric.requestCount}</td>
                            <td>{metric.averageResponseTime} ms</td>
                            <td>{metric.minResponseTime} ms</td>
                            <td>{metric.maxResponseTime} ms</td>
                        </tr>
                        
                    ))}
                </tbody>

            </table>

            <div>
                <h2>API Performance</h2>

                <p>
                    Total Endpoints: {metrics.length}
                </p>

                <p>
                    Slow Endpoints:
                    {
                        metrics.filter(
                            metric => metric.averageResponseTime > 1000
                        ).length
                    }
                </p>
            </div>
        </div>
    );
}