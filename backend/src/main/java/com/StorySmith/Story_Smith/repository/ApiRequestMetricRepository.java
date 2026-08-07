package com.StorySmith.Story_Smith.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.StorySmith.Story_Smith.model.telemetry.ApiRequestMetric;

import org.springframework.stereotype.Repository;

import com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO;
import com.StorySmith.Story_Smith.dto.Telemetry.SlowRequestDTO;
import com.StorySmith.Story_Smith.dto.Telemetry.ApiHealthDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.time.LocalDateTime;
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



    @Query("""
            SELECT new com.StorySmith.Story_Smith.dto.Telemetry.ApiPerformanceDTO(
                m.endpoint,
                m.httpMethod,
                COUNT(m),
                AVG(m.responseTimeMs),
                MAX(m.responseTimeMs),
                MIN(m.responseTimeMs)
            )
            FROM ApiRequestMetric m
            WHERE m.timestamp >= :start
            GROUP BY m.endpoint, m.httpMethod
        """)
        List<ApiPerformanceDTO> findApiPerformanceMetrics(
                @Param("start") LocalDateTime start
        );


    @Query("""
            SELECT new com.StorySmith.Story_Smith.dto.Telemetry.ApiHealthDTO(
                m.endpoint,
                m.httpMethod,
                COUNT(m),
                SUM(CASE WHEN m.statusCode >= 200 AND m.statusCode < 300 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.statusCode >= 400 AND m.statusCode < 500 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.statusCode >= 500 THEN 1 ELSE 0 END)
            ) FROM ApiRequestMetric m GROUP BY m.endpoint, m.httpMethod
            """)
    List<ApiHealthDTO> findApiHealthMetrics();


    @Query("""
            SELECT new com.StorySmith.Story_Smith.dto.Telemetry.ApiHealthDTO(
                m.endpoint,
                m.httpMethod,
                COUNT(m),
                SUM(CASE WHEN m.statusCode >= 200 AND m.statusCode < 300 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.statusCode >= 400 AND m.statusCode < 500 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.statusCode >= 500 THEN 1 ELSE 0 END)
            )
            FROM ApiRequestMetric m
            WHERE m.timestamp >= :start
            GROUP BY m.endpoint, m.httpMethod
        """)
        List<ApiHealthDTO> findApiHealthMetrics(
                @Param("start") LocalDateTime start
        );
    List<ApiRequestMetric> findByTimestampAfter(LocalDateTime timestamp);


    @Query("""
        SELECT new com.StorySmith.Story_Smith.dto.Telemetry.SlowRequestDTO(
            m.endpoint,
            m.httpMethod,
            m.responseTimeMs,
            m.statusCode,
            m.timestamp
        )
        FROM ApiRequestMetric m
        WHERE m.responseTimeMs >= :threshold
        ORDER BY m.responseTimeMs DESC
    """)
    Page<SlowRequestDTO> findSlowRequests(
            @Param("threshold") long threshold,
            Pageable pageable
    );



}
