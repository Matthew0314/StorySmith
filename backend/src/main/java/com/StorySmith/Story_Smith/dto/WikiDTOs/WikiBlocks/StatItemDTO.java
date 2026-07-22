package com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks;

public class StatItemDTO {
    private String id;
    private String label;
    private Integer value;

    public StatItemDTO() {
    }

    public StatItemDTO(String id, String label, Integer value) {
        this.id = id;
        this.label = label;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
    
}
