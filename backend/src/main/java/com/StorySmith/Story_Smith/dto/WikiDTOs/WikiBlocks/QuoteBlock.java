package com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks;

public class QuoteBlock extends WikiBlock {
    private String quoteText;

    public QuoteBlock() {
        super("quote");
    }

    public QuoteBlock(String quoteText) {
        super("quote");
        this.quoteText = quoteText;
    }

    public String getQuoteText() { return quoteText; }
    public void setQuoteText(String quoteText) { this.quoteText = quoteText; }
}
