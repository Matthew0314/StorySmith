package com.StorySmith.Story_Smith.dto.Telemetry;

public class ApiHealthDTO {
    String endpoint;

    String httpMethod;

    Long totalRequests;

    Long successfulRequests;

    Long clientErrors;

    Long serverErrors;

    Double errorRate;

    public ApiHealthDTO(String endpoint, String httpMethod, Long totalRequests, Long successfulRequests, Long clientErrors, Long serverErrors) {
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.totalRequests = totalRequests;
        this.successfulRequests = successfulRequests;
        this.clientErrors = clientErrors;
        this.serverErrors = serverErrors;
        this.errorRate = 0.0;
    }

    public void setErrorRate() {
        if (totalRequests > 0) {
            this.errorRate = ((double) (clientErrors + serverErrors) / totalRequests) * 100;
        } else {
            this.errorRate = 0.0;
        }
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public Long getTotalRequests() {
        return totalRequests;
    }

    public Long getSuccessfulRequests() {
        return successfulRequests;
    }

    public Long getClientErrors() {
        return clientErrors;
    }

    public Long getServerErrors() {
        return serverErrors;
    }

    public Double getErrorRate() {
        return errorRate;
    }

    
}
