package com.StorySmith.Story_Smith.dto.WikiDTOs;

public class CategoryDTO {
    private Long id;
    private String name;
    private int position;

    public CategoryDTO() {

    }

    public CategoryDTO(Long id, String name, int position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getPosition() {
        return position;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPosition(int position) {
        this.position = position;
    }

}
