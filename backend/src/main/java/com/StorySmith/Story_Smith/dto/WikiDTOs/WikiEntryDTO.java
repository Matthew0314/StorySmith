package com.StorySmith.Story_Smith.dto.WikiDTOs;

public class WikiEntryDTO {
    

    private Long id;
    private String title;
    private String content;
    // private String categoryName;
    // private String subcategoryName;
    private int position;
    private String subCategoryName;
    private String categoryName;
    private String imageUrl;
    private String summary;

    // public WikiEntryDTO(Long id, String title, String content, String categoryName, String subcategoryName) {
    //     this.id = id;
    //     this.title = title;
    //     this.content = content;
    //     this.categoryName = categoryName;
    //     this.subcategoryName = subcategoryName;
    // }

    public WikiEntryDTO(Long id, String title, String content, int position) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.position = position;
    }

    public WikiEntryDTO(Long id, String title, String content, int position, String subCategoryName, String categoryName, String imageUrl, String summary) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.position = position;
        this.subCategoryName = subCategoryName;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.summary = summary;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    // public String getCategoryName() {
    //     return categoryName;
    // }

    // public String getSubcategoryName() {
    //     return subcategoryName;
    // }
    public int getPosition() {
        return position;
    }

    public String getSubCategoryName() {
        return subCategoryName;
    }

    public void setSubCategoryName(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;

    }
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}

