package com.StorySmith.Story_Smith.model.telemetry;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "telemetry_events")
public class TelemetryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TelemetryEventType eventType;

    @Column(nullable = false)
    private Long userId;

    private LocalDateTime timestamp;

    // Json metadata field to store additional information about the event
    @Column(columnDefinition = "TEXT")
    private String metadata;

    public TelemetryEvent() {
    }

    public TelemetryEvent(
            TelemetryEventType eventType,
            Long userId,
            LocalDateTime timestamp,
            String metadata
    ) {
        this.eventType = eventType;
        this.userId = userId;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }

    public Long getId() {
        return id;
    }

    public TelemetryEventType getEventType() {
        return eventType;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMetadata() {
        return metadata;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setEventType(TelemetryEventType eventType) {
        this.eventType = eventType;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }


}
