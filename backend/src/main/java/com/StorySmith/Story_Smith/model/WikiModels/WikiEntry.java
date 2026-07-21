package com.StorySmith.Story_Smith.model.WikiModels;

import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.WikiModels.WikiCategory;


import jakarta.annotation.Generated;
import jakarta.persistence.*;

@Entity
@Table(name = "wiki_entries")
public class WikiEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projects project;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private WikiCategory category;

    //Can be null if the entry is directly under a category and not a subcategory
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id")
    private WikiSubcategory subcategory;

    // @Lob
    // @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    // private byte[] profilePicture;

    @Column(nullable = false)
    private int position;


    public WikiEntry() {
    }

    public WikiEntry(Projects project, String title, WikiCategory category, WikiSubcategory subcategory) {
        this.project = project;
        this.title = title;
        this.category = category;
        this.subcategory = subcategory;
    }

    public WikiEntry(Projects project, String title, WikiCategory category) {
        this.project = project;
        this.title = title;
        this.category = category;
        this.subcategory = null;
    }

    public WikiCategory getCategory() {
        return category;
    }


    //getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Projects getProject() {
        return project;
    }

    public void setProject(Projects project) {
        this.project = project;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public WikiSubcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(WikiSubcategory subcategory) {
        this.subcategory = subcategory;
    }

    public void setCategory(WikiCategory category) {
        this.category = category;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getContent() {
        // This method should return the content of the wiki entry.
        // You can implement it based on how you store the content in your database.
        // For example, if you have a field called 'content', you can return that.
        return ""; // Placeholder implementation
    }




}
