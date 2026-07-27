package com.StorySmith.Story_Smith.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;



@Service
public class LoreChatService {
   
    
    private final ChatClient chatClient;

    public LoreChatService(ChatClient.Builder chatClientBuilder) {
        // Build the ChatClient from Spring Boot's auto-configured builder
        this.chatClient = chatClientBuilder.build();
    }

    public String askQuestion(String promptText, String wikiContext) {
        // We set up a system prompt telling Gemini its role,
        // and inject the wiki context alongside the user's prompt.
        return this.chatClient.prompt()
                .system("""
                    You are StorySmith AI, an expert historian and worldbuilding assistant.
                    Your job is to answer user questions about their story world based on the provided lore.
                    If the lore doesn't explicitly answer the question, state that politely or offer creative suggestions that fit the existing tone.
                    """)
                .user(userSpec -> userSpec.text("""
                    --- WIKI CONTEXT ---
                    {context}
                    
                    --- USER QUESTION ---
                    {question}
                    """)
                    .param("context", wikiContext)
                    .param("question", promptText))
                .call()
                .content(); // Returns the generated response string
    }


}
