package com.StorySmith.Story_Smith.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import com.StorySmith.Story_Smith.service.ApiRequestMetricService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TelemetryInterceptor implements HandlerInterceptor {

    private final ApiRequestMetricService apiRequestMetricService;
    
    public TelemetryInterceptor(ApiRequestMetricService apiRequestMetricService) {
        this.apiRequestMetricService = apiRequestMetricService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Log the API request metric
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        long startTime = (Long) request.getAttribute("startTime");
        long duration = System.currentTimeMillis() - startTime;

        String endpoint =
            (String) request.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE
            );

        if (endpoint.startsWith("/api/telemetry")) {
            return;
        }
        // Save the API request metric
        apiRequestMetricService.recordRequest(
                endpoint,
                request.getMethod(),
                response.getStatus(),
                duration
        );
    }
    
}
