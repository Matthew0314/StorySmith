package com.StorySmith.Story_Smith.dto;

import com.StorySmith.Story_Smith.model.User;

public class UserSearchDTO {

    private Long id;
    private String username;
    private String email;

    public UserSearchDTO(User user) {
        id = user.getId();
        username = user.getUsername();
        email = user.getEmail();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
