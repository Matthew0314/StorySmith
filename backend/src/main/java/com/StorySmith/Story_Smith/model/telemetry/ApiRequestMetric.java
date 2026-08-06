package com.StorySmith.Story_Smith.model.telemetry;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "api_request_metrics")
public class ApiRequestMetric {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String endpoint;

    String httpMethod;

    int statusCode;

    long responseTimeMs;

    LocalDateTime timestamp;

    public ApiRequestMetric() {
    }

    public ApiRequestMetric(String endpoint, String httpMethod, int statusCode, long responseTimeMs, LocalDateTime timestamp) {
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.statusCode = statusCode;
        this.responseTimeMs = responseTimeMs;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public long getResponseTimeMs() {
        return responseTimeMs;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    

}
