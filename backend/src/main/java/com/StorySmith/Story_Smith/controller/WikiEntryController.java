package com.StorySmith.Story_Smith.controller;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryResponseDTO;
import com.StorySmith.Story_Smith.service.WikiEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{projectId}/wiki-entries")
public class WikiEntryController {

    private final WikiEntryService wikiEntryService;

    public WikiEntryController(WikiEntryService wikiEntryService) {
        this.wikiEntryService = wikiEntryService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<WikiEntryResponseDTO> getWikiEntryInfo(@PathVariable Long id) {
        System.out.println("Fetching wiki entry info for ID: " + id);
        return ResponseEntity.ok(wikiEntryService.getWikiEntryInfo(id).getBody());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WikiEntryResponseDTO> updateWikiEntryInfo(@PathVariable Long id, @RequestBody WikiEntryResponseDTO updatedEntry, @PathVariable Long projectId) {
        // Implement the update logic here
        return ResponseEntity.ok(wikiEntryService.updateWikiEntryInfo(projectId, id, updatedEntry).getBody());
    }
}