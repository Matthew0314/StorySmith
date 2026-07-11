package com.StorySmith.Story_Smith.dto;

import java.util.List;

public class ProjectMemberDTO {

    private Long userId;
    private String username;
    private String email;

    private List<RoleDTO> roles;


    public ProjectMemberDTO() {}


    public ProjectMemberDTO(
            Long userId,
            String username,
            String email,
            List<RoleDTO> roles
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }


    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }
}