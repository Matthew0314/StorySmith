package com.StorySmith.Story_Smith.model;

import jakarta.persistence.*;

import com.StorySmith.Story_Smith.model.ProjectRole;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.User;

@Entity
@Table(
    name = "project_collaborators",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"project_id", "user_id"})
    }
)
public class ProjectCollaborators {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projects project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectRole role;

    public ProjectCollaborators() {
    }

    public ProjectCollaborators(Projects project, User user, ProjectRole role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }

    public Projects getProject() {
        return project;
    }

    public void setProject(Projects project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProjectRole getRole() {
        return role;
    }

    public void setRole(ProjectRole role) {
        this.role = role;
    }




}
