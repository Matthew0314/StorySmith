import { useState } from "react";
import type { EndpointMetric } from "../../services/telemetryService";

interface EndpointAnalyticsTableProps {
    metrics: EndpointMetric[];
}

type SortField =
    | "endpoint"
    | "httpMethod"
    | "totalRequests"
    | "averageResponseTime"
    | "errorRate"
    | "serverErrors";

export default function EndpointAnalyticsTable({
    metrics
}: EndpointAnalyticsTableProps) {

    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("errorRate");
    const [ascending, setAscending] = useState(false);


    function handleSort(field: SortField) {
        if (field === sortField) {
            setAscending(!ascending);
        } else {
            setSortField(field);
            setAscending(true);
        }
    }


    const filteredMetrics = metrics
        .filter(metric =>
            metric.endpoint
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .sort((a, b) => {

            let valueA = a[sortField];
            let valueB = b[sortField];

            if (typeof valueA === "string" && typeof valueB === "string") {
                return ascending
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            return ascending
                ? Number(valueA) - Number(valueB)
                : Number(valueB) - Number(valueA);
        });


    return (
        <div className="endpoint-analytics">

            <h2>Endpoint Analytics</h2>


            <input
                type="text"
                placeholder="Search endpoints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />


            <table>
                <thead>
                    <tr>

                        <th onClick={() => handleSort("httpMethod")}>
                            Method
                        </th>

                        <th onClick={() => handleSort("endpoint")}>
                            Endpoint
                        </th>

                        <th onClick={() => handleSort("totalRequests")}>
                            Requests
                        </th>

                        <th onClick={() => handleSort("averageResponseTime")}>
                            Avg Response
                        </th>

                        <th>
                            Max Response
                        </th>

                        <th onClick={() => handleSort("errorRate")}>
                            Error Rate
                        </th>

                        <th onClick={() => handleSort("serverErrors")}>
                            5xx Errors
                        </th>

                    </tr>
                </thead>


                <tbody>

                    {filteredMetrics.map(metric => (

                        <tr key={`${metric.httpMethod}-${metric.endpoint}`}>

                            <td>
                                {metric.httpMethod}
                            </td>

                            <td>
                                {metric.endpoint}
                            </td>

                            <td>
                                {metric.totalRequests}
                            </td>

                            <td>
                                {metric.averageResponseTime.toFixed(2)} ms
                            </td>

                            <td>
                                {metric.maxResponseTime.toFixed(2)} ms
                            </td>

                            <td>
                                {metric.errorRate.toFixed(1)}%
                            </td>

                            <td>
                                {metric.serverErrors}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}