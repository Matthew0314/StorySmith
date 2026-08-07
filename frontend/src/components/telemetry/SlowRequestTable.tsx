import { useState } from "react";
import type { SlowRequestMetric } from "../../services/telemetryService";
import "../../assets/CSS/telemetry/SlowRequestTable.css";

interface SlowRequestsTableProps {
    requests?: SlowRequestMetric[];
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function SlowRequestsTable({
    requests,
    page,
    totalPages,
    setPage
}: SlowRequestsTableProps) {

    const [sortDescending, setSortDescending] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const slowRequests = requests ?? [];

    /*
     * Filter by endpoint
     */
    const filteredRequests = slowRequests.filter((request) =>
        request.endpoint
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    /*
     * Sort by response time
     */
    const sortedRequests = [...filteredRequests].sort((a, b) => {

        return sortDescending
            ? b.responseTimeMs - a.responseTimeMs
            : a.responseTimeMs - b.responseTimeMs;

    });

    /*
     * Status code styling
     */
    function getStatusClass(statusCode: number) {

        if (statusCode >= 200 && statusCode < 300) {
            return "status-success";
        }

        if (statusCode >= 400 && statusCode < 500) {
            return "status-client-error";
        }

        if (statusCode >= 500) {
            return "status-server-error";
        }

        return "";
    }


    return (
        <div className="slow-request-table">

            <h2>
                Slow Requests
            </h2>


            <div className="slow-request-info">

                <span>
                    Requests taking longer than <strong>1000 ms</strong>
                </span>

            </div>


            <div className="table-controls">

                <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />


                <button
                    onClick={() =>
                        setSortDescending(!sortDescending)
                    }
                >
                    {sortDescending
                        ? "Slowest First"
                        : "Fastest First"}
                </button>

            </div>


            {sortedRequests.length === 0 ? (

                <p className="empty-table">

                    {searchTerm
                        ? "No slow requests match your search."
                        : "No slow requests detected."}

                </p>

            ) : (

                <table>

                    <thead>

                        <tr>

                            <th>
                                Method
                            </th>

                            <th>
                                Endpoint
                            </th>

                            <th>
                                Duration
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Time
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {sortedRequests.map((request, index) => (

                            <tr
                                key={`${request.endpoint}-${request.timestamp}-${index}`}
                            >

                                <td>
                                    {request.httpMethod}
                                </td>


                                <td>
                                    {request.endpoint}
                                </td>


                                <td>
                                    {request.responseTimeMs.toFixed(0)} ms
                                </td>


                                <td>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            request.statusCode
                                        )}`}
                                    >
                                        {request.statusCode}
                                    </span>

                                </td>


                                <td>
                                    {new Date(
                                        request.timestamp
                                    ).toLocaleString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}


            {totalPages > 0 && (

                <div className="pagination">

                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>


                    <span>
                        Page {page + 1} of {totalPages}
                    </span>


                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>

            )}

        </div>
    );
}