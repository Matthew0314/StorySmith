package com.StorySmith.Story_Smith.model;

import jakarta.persistence.*;

import com.StorySmith.Story_Smith.model.ProjectRole;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.User;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
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

    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false)
    // private ProjectRole role;



    @ManyToMany
    @JoinTable(
        name="project_member_roles",
        joinColumns=@JoinColumn(name="member_id"),
        inverseJoinColumns=@JoinColumn(name="role_id")
    )
    private Set<ProjectRole> roles = new HashSet<>();

    public ProjectCollaborators() {
    }

    public ProjectCollaborators(
    Projects project,
    User user,
    ProjectRole role
    ){
        this.project = project;
        this.user = user;
        this.roles = new HashSet<>();
        this.roles.add(role);
    }

    public Set<ProjectRole> getRoles() {
        return roles;
    }


    public void addRole(ProjectRole role) {
        this.roles.add(role);
    }


    public void removeRole(ProjectRole role) {
        this.roles.remove(role);
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

    // public ProjectRole getRole() {
    //     return role;
    // }

    // public void setRole(ProjectRole role) {
    //     this.role = role;
    // }




}
