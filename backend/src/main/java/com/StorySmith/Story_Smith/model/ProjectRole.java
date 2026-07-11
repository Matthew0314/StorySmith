package com.StorySmith.Story_Smith.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "project_roles")
public class ProjectRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    private String color;

    @Column(nullable = false)
    private int position;


    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projects project;


    @ManyToMany
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private List<Permission> permissions = new ArrayList<>();


    public ProjectRole() {

    }

    public ProjectRole(String name, Projects project, String color, int position) {
        this.name = name;
        this.project = project;
        this.color = color;
        this.position = position;
    }

    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getColor() {
        return color;
    }


    public void setColor(String color) {
        this.color = color;
    }
}