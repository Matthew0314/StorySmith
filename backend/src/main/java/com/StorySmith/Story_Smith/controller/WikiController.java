package com.StorySmith.Story_Smith.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import com.StorySmith.Story_Smith.dto.WikiDTOs.CreateWikiDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import com.StorySmith.Story_Smith.dto.WikiDTOs.SaveCategoriesPayloadDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.StorySmith.Story_Smith.service.WikiService;

import com.StorySmith.Story_Smith.dto.WikiDTOs.EntriesListDTO;
import java.util.List;
import com.StorySmith.Story_Smith.dto.WikiDTOs.CategoryDTO;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryDTO;

import com.StorySmith.Story_Smith.dto.WikiDTOs.SubcategoryDTO;


@RestController
@RequestMapping("/api/projects/{projectId}/wiki")
@CrossOrigin(origins = "*")
public class WikiController {
    
    @Autowired
    private WikiService wikiService;

    @Autowired
    private com.StorySmith.Story_Smith.service.WikiCategoryService categoryService;


    @PostMapping("/create/{categoryId}")
    public ResponseEntity<?> createWiki(@PathVariable Long projectId, @PathVariable Long categoryId, @RequestBody CreateWikiDTO createWikiDTO) {
        
        return ResponseEntity.ok(wikiService.createWikiEntry(projectId, categoryId, createWikiDTO.getTitle(), createWikiDTO.getSubcategoryId()));
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getWikiByCategory(@PathVariable Long projectId, @PathVariable Long categoryId) {
        return null;
    }

    @GetMapping("/category")
    public ResponseEntity<?> getCategories(@PathVariable Long projectId) {
        return ResponseEntity.ok(wikiService.getCategories(projectId));
    }

    // @GetMapping("/category/{categoryId}/entries")
    // public ResponseEntity<List<EntriesListDTO>> getEntriesByCategory(@PathVariable Long projectId, @PathVariable Long categoryId) {
    //     return wikiService.getEntriesByCategory(projectId, categoryId);
    // }

    @GetMapping("/category/{categoryId}/entries")
    public ResponseEntity<List<WikiEntryDTO>> getEntriesByCategory(@PathVariable Long projectId, @PathVariable Long categoryId) {
        System.out.println("Fetching entries for projectId: " + projectId + ", categoryId: " + categoryId);
        return wikiService.getEntriesByCategory(projectId, categoryId);
    }

    @PostMapping("/category/{categoryId}/entry/{entryId}")
    public ResponseEntity<?> getEntryById(@PathVariable Long projectId, @PathVariable Long categoryId, @PathVariable Long entryId) {
        // return ResponseEntity.ok(wikiService.getEntryById(projectId, categoryId, entryId));
        return null;
    }

    @GetMapping("/subcategory")
    public ResponseEntity<?> getSubcategories(@PathVariable Long projectId) {
        return ResponseEntity.ok(wikiService.getSubcategories(projectId));
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long projectId, @PathVariable Long entryId) {
        wikiService.deleteEntry(projectId, entryId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/categories/batch")
    public ResponseEntity<Void> batchUpdateCategories(
            @PathVariable Long projectId,
            @RequestBody SaveCategoriesPayloadDTO payload) {
        
        categoryService.updateCategories(projectId, payload);
        return ResponseEntity.ok().build();
    }




}
