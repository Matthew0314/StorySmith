package com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks;
public class TextBlock extends WikiBlock {
    private String title;
    private String content;

    public TextBlock() {
        super("text");
    }

    public TextBlock(String title, String content) {
        super("text");
        this.title = title;
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
