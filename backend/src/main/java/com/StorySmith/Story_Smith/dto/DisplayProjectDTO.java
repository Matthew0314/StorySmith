package com.StorySmith.Story_Smith.dto;

public class DisplayProjectDTO {
    public Long id;
    public String name;
    public String description;
    public Long ownerId;

    public DisplayProjectDTO(Long id, String name, String description, Long ownerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
    }
}
