package com.StorySmith.Story_Smith.dto;

import com.StorySmith.Story_Smith.model.Projects;

public class CreateProjectDTO {
    public String name;
    public String description;
    public Long ownerId;
    public String color;

    public Projects toEntity(com.StorySmith.Story_Smith.model.User user) {
        return new Projects(name, description, user, color);
    }
}
