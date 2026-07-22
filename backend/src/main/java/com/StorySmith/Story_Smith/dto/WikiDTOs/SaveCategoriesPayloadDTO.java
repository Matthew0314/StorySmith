package com.StorySmith.Story_Smith.dto.WikiDTOs;
import java.util.List;


public class SaveCategoriesPayloadDTO {
    private List<CategoryDTO> categories;
    private List<SubcategoryDTO> subcategories;

    public SaveCategoriesPayloadDTO() {
    }

    public SaveCategoriesPayloadDTO(List<CategoryDTO> categories, List<SubcategoryDTO> subcategories) {
        this.categories = categories;
        this.subcategories = subcategories;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryDTO> categories) {
        this.categories = categories;
    }

    public List<SubcategoryDTO> getSubcategories() {
        return subcategories;
    }

    public void setSubcategories(List<SubcategoryDTO> subcategories) {
        this.subcategories = subcategories;
    }
}
