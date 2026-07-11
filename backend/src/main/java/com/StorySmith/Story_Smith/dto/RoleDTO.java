package com.StorySmith.Story_Smith.dto;

import java.util.List;

public class RoleDTO {

    private Long id;
    private String name;

    private List<String> permissions;


    public RoleDTO() {}


    public RoleDTO(
            Long id,
            String name,
            List<String> permissions
    ) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<String> getPermissions() {
        return permissions;
    }
}