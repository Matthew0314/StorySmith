package com.StorySmith.Story_Smith.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.StorySmith.Story_Smith.model.telemetry.TelemetryEvent;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;

public interface TelemetryRepository extends JpaRepository<TelemetryEvent, Long> {
    long countByEventType(TelemetryEventType eventType);

    @Query("""
        SELECT COUNT(t)
        FROM TelemetryEvent t
        WHERE t.eventType = :eventType
        AND t.timestamp >= :start
    """)
    long countEventsSince(
            @Param("eventType") TelemetryEventType eventType,
            @Param("start") LocalDateTime start
    );
}
