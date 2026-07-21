package com.StorySmith.Story_Smith.model.WikiModels.components;

public class TextComponent implements WikiComponent {
    
    private String title;

    private String text;

    TextComponent() {}

    public String getTitle() {
        return title;
    }

    public String getText() {
        return text;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setText(String text) {
        this.text = text;
    }

}
