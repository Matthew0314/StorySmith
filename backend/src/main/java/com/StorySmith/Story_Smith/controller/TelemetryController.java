package com.StorySmith.Story_Smith.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO;
import com.StorySmith.Story_Smith.dto.Telemetry.TelemetryMetricsDTO;
import com.StorySmith.Story_Smith.service.TelemetryAnalyticsService;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;


@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryController {

    private final TelemetryAnalyticsService telemetryAnalyticsService;

    public TelemetryController(TelemetryAnalyticsService telemetryAnalyticsService) {
        this.telemetryAnalyticsService = telemetryAnalyticsService;
    }


    @GetMapping("/dashboard")
    public TelemetryMetricsDTO getDashboard() {
        return telemetryAnalyticsService.getMetrics();
    }

    @GetMapping("/api-performance")
    public List<ApiPerformanceDTO> getApiPerformance() {
        return telemetryAnalyticsService.getApiPerformanceMetrics();
    }
    
}