package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;

import com.StorySmith.Story_Smith.model.telemetry.TelemetryEvent;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;
import com.StorySmith.Story_Smith.repository.TelemetryRepository;
import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;

import com.StorySmith.Story_Smith.config.ObjectMapperConfig;

@Service
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;
    private final ObjectMapperConfig objectMapperConfig;


    public TelemetryService(
            TelemetryRepository telemetryRepository,
            ObjectMapperConfig objectMapperConfig
    ) {
        this.telemetryRepository = telemetryRepository;
        this.objectMapperConfig = objectMapperConfig;
    }


    public void recordEvent(TelemetryEventType eventType, Long userId, Map<String, Object> metadata) {

        String metadataJson = null;

        try {
            metadataJson = objectMapperConfig.objectMapper().writeValueAsString(metadata);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert telemetry metadata", e);
        }


        TelemetryEvent event = new TelemetryEvent(
                eventType,
                userId,
                LocalDateTime.now(),
                metadataJson
        );

        telemetryRepository.save(event);
    }
}
