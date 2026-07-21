package com.StorySmith.Story_Smith.dto.WikiDTOs;

public class CreateWikiDTO {
    private String title;
    private Long subcategoryId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Long subcategoryId) { this.subcategoryId = subcategoryId; }
}
