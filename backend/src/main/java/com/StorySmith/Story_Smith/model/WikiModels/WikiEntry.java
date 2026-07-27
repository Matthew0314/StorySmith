package com.StorySmith.Story_Smith.model.WikiModels;

import org.springframework.core.annotation.Order;

import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.WikiModels.WikiCategory;

import jakarta.persistence.*;

import com.StorySmith.Story_Smith.model.WikiModels.WikiSubcategory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;

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

    @Column(name = "image_url")
    private String imageUrl; // New field for storing the image URL

    // @Lob
    // @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    // private byte[] profilePicture;

    @OneToMany(mappedBy = "wikiEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private java.util.List<WikiEntryComponent> components = new java.util.ArrayList<>();

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


    // Helper methods to keep bi-directional relationship in sync
    public void addComponent(WikiEntryComponent component) {
        components.add(component);
        component.setWikiEntry(this);
    }

    public void removeComponent(WikiEntryComponent component) {
        components.remove(component);
        component.setWikiEntry(null);
    }

    public java.util.List<WikiEntryComponent> getComponents() { return components; }
    public void setComponents(java.util.List<WikiEntryComponent> components) { this.components = components; }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public String getSummary() {
        ObjectMapper mapper = new ObjectMapper();

        for (WikiEntryComponent component : components) {
            if (component.getComponentType() == ComponentType.TEXT) {
                String contentJson = component.getContentJson();
                
                if (contentJson != null && !contentJson.isBlank()) {
                    try {
                        JsonNode root = mapper.readTree(contentJson);
                        // Reads the "textContent" field as plain text
                        if (root.has("textContent")) {
                            return root.get("textContent").asText();
                        }
                    } catch (Exception e) {
                        // Log parsing error or fall back to returning raw string safely
                        System.err.println("Failed to parse content JSON: " + e.getMessage());
                    }
                }
            }
        }
        return "";
    }




}
