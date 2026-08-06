package com.StorySmith.Story_Smith.service;
import java.util.List;
import com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.StorySmith.Story_Smith.repository.TelemetryRepository;
import com.StorySmith.Story_Smith.repository.ApiRequestMetricRepository;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;

import com.StorySmith.Story_Smith.dto.Telemetry.TelemetryMetricsDTO;

@Service
public class TelemetryAnalyticsService {
    private final TelemetryRepository telemetryRepository;
    private final UserRepository userRepository;
    private final ApiRequestMetricRepository apiRequestMetricRepository;

    public TelemetryAnalyticsService(TelemetryRepository telemetryRepository, UserRepository userRepository, ApiRequestMetricRepository apiRequestMetricRepository) {
        this.telemetryRepository = telemetryRepository;
        this.userRepository = userRepository;
        this.apiRequestMetricRepository = apiRequestMetricRepository;
    }

    public TelemetryMetricsDTO getMetrics() {
        TelemetryMetricsDTO metrics = new TelemetryMetricsDTO();
        metrics.setTotalUsers(userRepository.count());

        LocalDateTime today = LocalDate.now().atStartOfDay();
        metrics.setDailyActiveUsers(telemetryRepository.countEventsSince(TelemetryEventType.USER_LOGIN_SUCCESS, today));
        metrics.setTotalProjectsCreated(telemetryRepository.countByEventType(TelemetryEventType.CREATE_PROJECT));
        metrics.setTotalWikiPagesCreated(telemetryRepository.countByEventType(TelemetryEventType.WIKI_PAGE_CREATED));
        // metrics.setTotalAiRequests(telemetryRepository.countByEventType(TelemetryEventType.AI_REQUEST_MADE.name()));
        metrics.setTotalAiRequests(0L);
        return metrics;
    }


    public List<ApiPerformanceDTO> getApiPerformanceMetrics() {
        List<ApiPerformanceDTO> apiPerformanceMetrics = apiRequestMetricRepository.findApiPerformanceMetrics();
        for (ApiPerformanceDTO metric : apiPerformanceMetrics) {
            System.out.println("API Performance Metrics: " + metric.getEndpoint() + ", " + metric.getMethod() + ", " + metric.getRequestCount() + ", " + metric.getAverageResponseTime() + ", " + metric.getMaxResponseTime() + ", " + metric.getMinResponseTime());
        }
        return apiPerformanceMetrics;
    }
}
