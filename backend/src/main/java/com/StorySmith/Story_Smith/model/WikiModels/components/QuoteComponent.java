package com.StorySmith.Story_Smith.model.WikiModels.components;

public class QuoteComponent implements WikiComponent {
    

    private String title;
    private String quote;


    QuoteComponent() {}

    public String getTitle() {
        return title;
    }

    public String getQuote() {
        return quote;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

}
