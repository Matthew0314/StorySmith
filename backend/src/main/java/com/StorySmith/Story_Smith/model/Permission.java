package com.StorySmith.Story_Smith.model;

import jakarta.persistence.*;

@Entity
@Table(name="permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true)
    private String name;


    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }
}