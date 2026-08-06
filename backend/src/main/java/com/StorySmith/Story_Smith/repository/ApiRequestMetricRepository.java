package com.StorySmith.Story_Smith.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.StorySmith.Story_Smith.model.telemetry.ApiRequestMetric;

import org.springframework.stereotype.Repository;

import com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO;
import java.util.List;

@Repository
public interface ApiRequestMetricRepository extends JpaRepository<ApiRequestMetric, Long> {
    

    @Query("""
            SELECT new com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO(
                m.endpoint,
                m.httpMethod,
                COUNT(m),
                AVG(m.responseTimeMs),
                MAX(m.responseTimeMs),
                MIN(m.responseTimeMs)
            ) FROM ApiRequestMetric m GROUP BY m.endpoint, m.httpMethod
            """)
    List<ApiPerformanceDTO> findApiPerformanceMetrics();

}
