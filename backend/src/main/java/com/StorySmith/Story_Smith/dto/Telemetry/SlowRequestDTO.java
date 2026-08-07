package com.StorySmith.Story_Smith.dto.Telemetry;
import java.time.LocalDateTime;

import lombok.Getter;


@Getter
public class SlowRequestDTO {
    
    String endpoint;

    String httpMethod;

    Long responseTimeMs;

    Integer statusCode;

    LocalDateTime timestamp;

    public SlowRequestDTO(String endpoint, String httpMethod, Long responseTimeMs, Integer statusCode, LocalDateTime timestamp) {
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.responseTimeMs = responseTimeMs;
        this.statusCode = statusCode;
        this.timestamp = timestamp;
    }
}
