package com.StorySmith.Story_Smith.model.WikiModels;
import com.StorySmith.Story_Smith.model.Projects;
import jakarta.persistence.*;

@Entity
@Table(name = "wiki_subcategories")
public class WikiSubcategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private WikiCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Projects project;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position;

    public WikiSubcategory() {
    }

    public WikiSubcategory(WikiCategory category, Projects project, String name, int position) {
        this.category = category;
        this.project = project;
        this.name = name;
        this.position = position;
    }

    public WikiCategory getCategory() {
        return category;
    }

    public void setCategory(WikiCategory category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }
}
