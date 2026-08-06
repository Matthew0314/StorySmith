package com.StorySmith.Story_Smith.service;

import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.StorySmith.Story_Smith.repository.WikiCategoryRepository;
import com.StorySmith.Story_Smith.repository.WikiEntryRepository;

import com.StorySmith.Story_Smith.dto.WikiDTOs.CategoryDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import com.StorySmith.Story_Smith.model.WikiModels.WikiCategory;

import com.StorySmith.Story_Smith.dto.WikiDTOs.EntriesListDTO;

import com.StorySmith.Story_Smith.repository.WikiSubcategoryRepository;

import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryDTO;

import com.StorySmith.Story_Smith.model.Projects;

import com.StorySmith.Story_Smith.model.WikiModels.WikiSubcategory;
import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import com.StorySmith.Story_Smith.repository.WikiEntryRepository;
import com.StorySmith.Story_Smith.dto.WikiDTOs.SubcategoryDTO;
import java.util.Comparator;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntryComponent;
import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;

import org.springframework.security.core.Authentication;
import com.StorySmith.Story_Smith.security.AuthenticatedUser;

import com.StorySmith.Story_Smith.model.User;
import java.util.Map;


@Service
public class WikiService {
    
    @Autowired
    private WikiCategoryRepository wikiCategoryRepository;

    @Autowired
    private WikiSubcategoryRepository wikiSubcategoryRepository;

    @Autowired
    private WikiEntryRepository wikiEntryRepository;

    @Autowired
    private TelemetryService telemetryService;

    @Autowired
    private com.StorySmith.Story_Smith.repository.ProjectRepository projectRepository;

    public List<CategoryDTO> getCategories(Long projectId) {
        List<CategoryDTO> categories = wikiCategoryRepository.findByProjectId(projectId)
                .stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getPosition()))
                .toList();

        return categories;
    }


    public ResponseEntity<List<WikiEntryDTO>> getEntriesByCategory(Long projectId, Long categoryId) {
        List<WikiEntryDTO> entries = wikiEntryRepository.findByProjectIdAndCategoryId(projectId, categoryId)
                .stream()
                .map(entry -> new WikiEntryDTO(entry.getId(), entry.getTitle(), entry.getContent(), entry.getPosition(),
                        entry.getSubcategory() != null ? entry.getSubcategory().getName() : null,
                        entry.getCategory() != null ? entry.getCategory().getName() : null,
                        entry.getImageUrl(),
                        entry.getSummary() // Include the summary in the DTO
                ))
                .toList();

        if (!entries.isEmpty()) {
            List<WikiEntryDTO> sortedEntries = entries.stream()
                    .sorted(Comparator.comparingInt(WikiEntryDTO::getPosition))
                    .toList();
            return ResponseEntity.ok(sortedEntries);
        } else {
            return ResponseEntity.ok(entries);
        }
    }

    // Delete a wiki entry by its ID and project ID
    public ResponseEntity<?> deleteEntry(Long projectId, Long entryId, Authentication authentication) {

        // Check if the user is authenticated
        AuthenticatedUser authenticatedUser = (AuthenticatedUser)authentication.getPrincipal();
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).body("Unauthorized: User not authenticated");
        }

        // Check if the authenticated user is the owner or a collaborator of the project
        // List<User> collaborators = projectRepository.findCollaboratorsByProjectId(projectId); 
        // if (!collaborators.stream().anyMatch(user -> user.getId().equals(authenticatedUser.getId()))) {
        //     return ResponseEntity.status(403).body("Forbidden: User does not have permission to delete this entry");
        // }

        // Check if the entry exists and belongs to the specified project
        WikiEntry entry = wikiEntryRepository.findById(entryId).orElse(null);
        if (entry == null || !entry.getProject().getId().equals(projectId)) {
            return ResponseEntity.notFound().build();
        }

        // Delete the entry
        wikiEntryRepository.delete(entry);

        // Record telemetry event for wiki page deletion
        telemetryService.recordEvent(
            TelemetryEventType.WIKI_PAGE_DELETED,
            authenticatedUser.getId(),
            Map.of(
                "projectId", projectId,
                "entryId", entryId
            )
        );

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> getSubcategories(Long projectId) {
        List<SubcategoryDTO> subcategories = wikiSubcategoryRepository.findByProjectId(projectId)
                .stream()
                .map(subcategory -> new SubcategoryDTO(subcategory.getId(), subcategory.getName(), subcategory.getPosition(), subcategory.getCategory().getId()))
                .toList();

        return ResponseEntity.ok(subcategories);
    }

    // Create a new wiki entry with default components
    public ResponseEntity<?> createWikiEntry(Long projectId, Long categoryId, String title, Long subCategoryId, Authentication authentication) {

        // Check if the user is authenticated
        AuthenticatedUser authenticatedUser = (AuthenticatedUser)authentication.getPrincipal();
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).body("Unauthorized: User not authenticated");
        }

        // Check if the authenticated user is the owner or a collaborator of the project
        // List<User> collaborators = projectRepository.findCollaboratorsByProjectId(projectId); 
        // if (!collaborators.stream().anyMatch(user -> user.getId().equals(authenticatedUser.getId()))) {
        //     return ResponseEntity.status(403).body("Forbidden: User does not have permission to create this entry");
        // }

    
        // Check if the category exists
        WikiCategory category = wikiCategoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            System.out.println("Category not found for categoryId: " + categoryId);
            return ResponseEntity.badRequest().body("Invalid category ID");
        }

        // Find the maximum position for entries in the specified category
        Integer maxPosition = wikiEntryRepository.findMaxPositionByProjectIdAndCategoryId(projectId, categoryId);
        if (maxPosition == null) {
            maxPosition = 0;
        }

        // Create the new wiki entry and set its position to maxPosition + 1
        Projects project = category.getProject();
        WikiEntry newEntry = new WikiEntry(project, title, category);
        if (subCategoryId != null) {
            WikiSubcategory subcategory = wikiSubcategoryRepository.findById(subCategoryId).orElse(null);
            if (subcategory != null) {
                newEntry.setSubcategory(subcategory);
            }
        }

        newEntry.setPosition(maxPosition + 1);
        wikiEntryRepository.save(newEntry);

        // Log the creation of the new entry
        telemetryService.recordEvent(
            TelemetryEventType.WIKI_PAGE_CREATED,
            authenticatedUser.getId(),
            Map.of(
                "projectId", projectId,
                "entryId", newEntry.getId()
            )
        );

        return ResponseEntity.ok("Wiki entry created successfully");
    }

    public void setDefaultWikiCategories(Projects project) {
        // Set default categories for the new project
        // This is a placeholder; implement your logic to add default categories
        WikiCategory defaultCategory1 = wikiCategoryRepository.save(new WikiCategory(project, "Characters", 1));

        WikiCategory defaultCategory2 = wikiCategoryRepository.save(new WikiCategory(project, "Locations", 2));

        WikiCategory defaultCategory3 = wikiCategoryRepository.save(new WikiCategory(project, "Items", 3));

        WikiSubcategory defaultSubcategory1 = wikiSubcategoryRepository.save(new WikiSubcategory(defaultCategory1, project, "Main Characters", 1));

        WikiSubcategory defaultSubcategory2 = wikiSubcategoryRepository.save(new WikiSubcategory(defaultCategory1, project, "Supporting Characters", 2));

        WikiSubcategory defaultSubcategory3 = wikiSubcategoryRepository.save(new WikiSubcategory(defaultCategory2, project, "Main Locations", 1));
        WikiSubcategory defaultSubcategory4 = wikiSubcategoryRepository.save(new WikiSubcategory(defaultCategory3, project, "Main Items", 2));
    }


    private void setDefaultWikiComponenets(WikiEntry entry) {
        String defaultTextJson = "{\"title\": \"Overview\", \"textContent\": \"This is the default content for the wiki entry.\"}";
        WikiEntryComponent defaultComponent = new WikiEntryComponent(entry, 1, ComponentType.TEXT, defaultTextJson);

        String defaultQuoteJson = "{\"quoteText\": \"This is a default quote.\"}";
        WikiEntryComponent defaultQuoteComponent = new WikiEntryComponent(entry, 2, ComponentType.QUOTE, defaultQuoteJson);

        entry.addComponent(defaultComponent);
        entry.addComponent(defaultQuoteComponent);
    }





}
