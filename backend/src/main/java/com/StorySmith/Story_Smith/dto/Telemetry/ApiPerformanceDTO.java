package com.StorySmith.Story_Smith.dto.Telemetry;

public class ApiPerformanceDTO {
    private String endpoint;

    private String method;

    private Long requestCount;

    private Double averageResponseTime;

    private Long maxResponseTime;

    private Long minResponseTime;

    public ApiPerformanceDTO(String endpoint, String method, Long requestCount, Double averageResponseTime, Long maxResponseTime, Long minResponseTime) {
        this.endpoint = endpoint;
        this.method = method;
        this.requestCount = requestCount;
        this.averageResponseTime = averageResponseTime;
        this.maxResponseTime = maxResponseTime;
        this.minResponseTime = minResponseTime;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getMethod() {
        return method;
    }

    public Long getRequestCount() {
        return requestCount;
    }

    public Double getAverageResponseTime() {
        return averageResponseTime;
    }

    public Long getMaxResponseTime() {
        return maxResponseTime;
    }

    public Long getMinResponseTime() {
        return minResponseTime;
    }
    


}
