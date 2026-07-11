package com.StorySmith.Story_Smith.dto;

import java.util.List;

public class ProjectSettingsDTO {

    private Long projectId;
    private String projectName;
    private Boolean useAI;

    private List<ProjectMemberDTO> members;
    private List<RoleDTO> roles;


    public ProjectSettingsDTO() {}


    public ProjectSettingsDTO(
            Long projectId,
            String projectName,
            List<ProjectMemberDTO> members,
            List<RoleDTO> roles,
            Boolean useAI
    ) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.members = members;
        this.roles = roles;
        this.useAI = useAI;
    }


    public Long getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public List<ProjectMemberDTO> getMembers() {
        return members;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public Boolean getUseAI() {
        return useAI;
    }

     public void setUseAI(Boolean useAI) {
        this.useAI = useAI;
    }
}