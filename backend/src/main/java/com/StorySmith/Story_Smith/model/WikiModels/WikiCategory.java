package com.StorySmith.Story_Smith.model.WikiModels;

import jakarta.persistence.*;

import com.StorySmith.Story_Smith.model.Projects;

@Entity
@Table(name = "wiki_categories")
public class WikiCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projects project;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position;

    // @Lob
    // @Column(name = "icon", columnDefinition = "LONGBLOB")
    // private byte[] icon;

    public WikiCategory() {
    }

    public WikiCategory(Projects project, String name, int position) {
        this.project = project;
        this.name = name;
        this.position = position;
    }


    // public byte[] getIcon() {
    //     return icon;
    // }

    // public void setIcon(byte[] icon) {
    //     this.icon = icon;
    // }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Projects getProject() {
        return project;
    }
    public void setProject(Projects project) {
        this.project = project;
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

    public void setId(Long id) {
        this.id = id;
    }
}
