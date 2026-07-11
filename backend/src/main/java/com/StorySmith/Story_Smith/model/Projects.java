package com.StorySmith.Story_Smith.model;

import jakarta.persistence.*;

import com.StorySmith.Story_Smith.model.ProjectRole;
import com.StorySmith.Story_Smith.model.User;

import java.util.List;

@Entity
@Table(name = "projects")
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String color;

    @OneToMany(mappedBy = "project")
    private List<ProjectCollaborators> members;

    @Column(nullable = false)
    private Boolean use_ai;

    @Column(nullable = false)
    private Boolean deleted;


    public Projects() {
    }

    public Projects(String name, String description, User owner, String color) {
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.color = color;
        this.use_ai = false;
        this.deleted = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return owner != null ? owner.getId() : null;
    }

    public User getOwner() {
        return owner;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getUseAI() {
        return use_ai;
    }

    public void setUseAI(Boolean use_ai) {
        this.use_ai = use_ai;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}