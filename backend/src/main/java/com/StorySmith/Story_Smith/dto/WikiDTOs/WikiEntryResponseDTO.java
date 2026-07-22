// package com.StorySmith.Story_Smith.dto.WikiDTOs;

// import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
// import com.StorySmith.Story_Smith.model.WikiModels.WikiEntryComponent;
// import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
// import com.StorySmith.Story_Smith.model.WikiModels.components.WikiComponent;
// import com.fasterxml.jackson.annotation.JsonRawValue;

// import lombok.NoArgsConstructor;

// import java.util.List;
// import java.util.stream.Collectors;

// @NoArgsConstructor
// public class WikiEntryResponseDTO {

//     private Long id;
//     private String title;
//     private String categoryName;
//     private String subCategoryName;
//     private List<BlockResponseDTO> blocks;

//     public WikiEntryResponseDTO(WikiEntry entry) {
//         this.id = entry.getId();
//         this.title = entry.getTitle();
//         if (entry.getCategory() != null) {
//             this.categoryName = entry.getCategory().getName();
//         }
//         if (entry.getSubcategory() != null) {
//             this.subCategoryName = entry.getSubcategory().getName();
//         }

//         // Map components to the React-friendly block format
//         this.blocks = entry.getComponents().stream()
//             .map(BlockResponseDTO::new)
//             .collect(Collectors.toList());
//     }

//     // Getters
//     public Long getId() { return id; }
//     public String getTitle() { return title; }
//     public String getCategoryName() { return categoryName; }
//     public String getSubCategoryName() { return subCategoryName; }
//     public List<BlockResponseDTO> getBlocks() { return blocks; }

//     // Inner DTO for individual blocks
//     public static class BlockResponseDTO {
//         private Long id;
//         private String type; // e.g., "text", "quote"
//         private int position;

//         @JsonRawValue // Merges raw JSON directly into the output block object
//         private String data;

//         public BlockResponseDTO(WikiEntryComponent component) {
//             this.id = component.getId();
//             this.position = component.getPosition();
//             // Convert Enum "TEXT" -> "text" to match React union discriminated types
//             this.type = component.getComponentType().name().toLowerCase();
//             this.data = component.getContentJson();
//         }

//         public BlockResponseDTO() {
//             // Default constructor for new blocks
//         }

//         public Long getId() { return id; }
//         public String getType() { return type; }
//         public String getData() { return data; }
//         public int getPosition() { return position; }

//         public void setWikiEntry(Object wikiEntry) {
//             // Placeholder for setting the wiki entry reference if needed
//         }


//         public void setId(Long id) { this.id = id; }
//         public void setType(String type) { this.type = type; }
//         public void setData(String data) { this.data = data; }
//         public void setPosition(int position) { this.position = position; }
//     }
// }


package com.StorySmith.Story_Smith.dto.WikiDTOs;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import com.StorySmith.Story_Smith.model.WikiModels.WikiEntryComponent;
import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
import com.StorySmith.Story_Smith.model.WikiModels.components.WikiComponent;
import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

@NoArgsConstructor
public class WikiEntryResponseDTO {

    private Long id;
    private String title;
    private String categoryName;
    private String subCategoryName;
    private List<BlockResponseDTO> blocks;

    public WikiEntryResponseDTO(WikiEntry entry) {
        this.id = entry.getId();
        this.title = entry.getTitle();
        if (entry.getCategory() != null) {
            this.categoryName = entry.getCategory().getName();
        }
        if (entry.getSubcategory() != null) {
            this.subCategoryName = entry.getSubcategory().getName();
        }

        // Map components to the React-friendly block format
        this.blocks = entry.getComponents().stream()
            .map(BlockResponseDTO::new)
            .collect(Collectors.toList());
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getSubCategoryName() { return subCategoryName; }
    public void setSubCategoryName(String subCategoryName) { this.subCategoryName = subCategoryName; }

    public List<BlockResponseDTO> getBlocks() { return blocks; }
    public void setBlocks(List<BlockResponseDTO> blocks) { this.blocks = blocks; }

    // Inner DTO for individual blocks
    public static class BlockResponseDTO {
        private Long id;
        private String type; // e.g., "text", "quote"
        private int position;

        // Change from String + @JsonRawValue -> Object
        // Jackson now accepts JSON Objects during PUT/POST requests
        private Object data;

        public BlockResponseDTO() {
            // Default constructor for Jackson deserialization
        }

        public BlockResponseDTO(WikiEntryComponent component) {
            this.id = component.getId();
            this.position = component.getPosition();
            this.type = component.getComponentType().name().toLowerCase();

            // Convert stored JSON String into an Object for Jackson output
            try {
                if (component.getContentJson() != null && !component.getContentJson().isEmpty()) {
                    ObjectMapper mapper = new ObjectMapper();
                    this.data = mapper.readValue(component.getContentJson(), Object.class);
                } else {
                    this.data = null;
                }
            } catch (Exception e) {
                this.data = component.getContentJson();
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Object getData() { return data; }
        public void setData(Object data) { this.data = data; }

        public int getPosition() { return position; }
        public void setPosition(int position) { this.position = position; }
    }
}