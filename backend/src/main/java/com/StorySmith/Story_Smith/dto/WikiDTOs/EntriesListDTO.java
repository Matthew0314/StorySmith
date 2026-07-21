package com.StorySmith.Story_Smith.dto.WikiDTOs;

import java.util.List;


public class EntriesListDTO {
    
    CategoryDTO subcategory;

    List<WikiEntryDTO> entries;

    public EntriesListDTO(CategoryDTO subcategory, List<WikiEntryDTO> entries) {
        this.subcategory = subcategory;
        this.entries = entries;
    }


    public CategoryDTO getSubcategory() {
        return subcategory;
    }

    public List<WikiEntryDTO> getEntries() {
        return entries;
    }
}
