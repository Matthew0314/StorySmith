package com.StorySmith.Story_Smith.dto.WikiDTOs;

public class SubcategoryDTO {
    private Long id;
    private String name;
    private int position;
    private Long categoryId;

    public SubcategoryDTO(Long id, String name, int position, Long categoryId) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.categoryId = categoryId;
    }

    public SubcategoryDTO() {
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

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Long getCategoryId() {
        return categoryId;
    }


}
