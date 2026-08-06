package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;
import com.StorySmith.Story_Smith.model.telemetry.ApiRequestMetric;
import com.StorySmith.Story_Smith.repository.ApiRequestMetricRepository;

@Service
public class ApiRequestMetricService {
    private final ApiRequestMetricRepository apiRequestMetricRepository;

    public ApiRequestMetricService(ApiRequestMetricRepository apiRequestMetricRepository) {
        this.apiRequestMetricRepository = apiRequestMetricRepository;
    }

    public void recordRequest(String endpoint, String method, int statusCode, long duration) {

        ApiRequestMetric metric = new ApiRequestMetric(endpoint, method, statusCode, duration, java.time.LocalDateTime.now());

        apiRequestMetricRepository.save(metric);
        // Logic to record the API request metric
        // This could involve saving the metric to a database or sending it to a telemetry service
    }
}
