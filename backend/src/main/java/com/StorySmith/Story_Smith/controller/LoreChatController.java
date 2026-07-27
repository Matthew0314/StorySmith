package com.StorySmith.Story_Smith.controller;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import com.StorySmith.Story_Smith.service.LoreChatService;

import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.StorySmith.Story_Smith.repository.ProjectRepository;

import java.util.List;
import com.StorySmith.Story_Smith.repository.WikiEntryRepository;

@RestController
@RequestMapping("/api/ai")
public class LoreChatController {
    
    private final LoreChatService loreChatService;
    private final WikiEntryRepository wikiRepository; // Your JPA Repository for PostgreSQL

    @Autowired
    private ProjectRepository projectRepository; // Your JPA Repository for PostgreSQL


    public LoreChatController(LoreChatService loreChatService, WikiEntryRepository wikiRepository) {
        this.loreChatService = loreChatService;
        this.wikiRepository = wikiRepository;
    }

    public record ChatRequest(Long projectId, String question) {}
    public record ChatResponse(String answer) {}

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {




        // 1. Get the wiki entries from PostgreSQL using the projectId
        List<WikiEntry> entries = wikiRepository.findByProjectId(request.projectId());

        Boolean aiEnabled = projectRepository.findById(request.projectId())
                .map(project -> project.getUseAI())
                .orElse(false);

        if (!aiEnabled) {
            return new ChatResponse("I apologize but AI features are currently disabled for this project. Please contact the project administrator to enable AI functionality.");
        }

        // 2. Format all wiki entries into one clean text string (Markdown format)
        String fullWikiText = entries.stream()
                .map(entry -> "## " + entry.getTitle() + "\n" + getContent(entry)) // Assuming getContent is a method that formats the content of a WikiEntry
                .collect(Collectors.joining("\n\n"));

        // 3. Pass the fetched DB lore + user question to Gemini
        String answer = loreChatService.askQuestion(request.question(), fullWikiText);

        // 4. Return the response back to React
        return new ChatResponse(answer);

        // return new ChatResponse(fullWikiText); // For now, just return the full wiki text for testing");
    }


    public String getContent(WikiEntry entry) {
        StringBuilder contentBuilder = new StringBuilder();
        contentBuilder.append("## ").append(entry.getTitle()).append("\n");
        contentBuilder.append(entry.getContent()).append("\n");

        for (var component : entry.getComponents()) {
            // contentBuilder.append("### ").append(component.getTitle()).append("\n");
            contentBuilder.append(component.getContentJson()).append("\n");
            // Handle other component types if needed
        }

        return contentBuilder.toString();
    }

    @GetMapping("/active")
    public boolean getActiveStatus() {
        return true;
    }
}
