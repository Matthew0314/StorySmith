package com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.util.UUID;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = TextBlock.class, name = "text"),
    @JsonSubTypes.Type(value = QuoteBlock.class, name = "quote"),
    @JsonSubTypes.Type(value = StatBlockDTO.class, name = "stats")
})
public abstract class WikiBlock {
    private String id;
    private String type;
    private Integer position;

    WikiBlock() {}

    WikiBlock(String type) {
        this.id = UUID.randomUUID().toString();
        this.type = type;
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public Integer getPosition() { return position; }

    public void setId(String id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setPosition(Integer position) { this.position = position; }

}
