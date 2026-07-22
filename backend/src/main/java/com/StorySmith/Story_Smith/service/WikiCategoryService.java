package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.StorySmith.Story_Smith.repository.WikiCategoryRepository;
import com.StorySmith.Story_Smith.repository.WikiEntryRepository;
import com.StorySmith.Story_Smith.repository.WikiSubcategoryRepository;
import com.StorySmith.Story_Smith.dto.WikiDTOs.CategoryDTO;
import java.util.Map;
import java.util.HashMap;
import com.StorySmith.Story_Smith.repository.WikiSubcategoryRepository;

import jakarta.transaction.Transactional;

import com.StorySmith.Story_Smith.repository.WikiEntryRepository;

import com.StorySmith.Story_Smith.dto.WikiDTOs.SaveCategoriesPayloadDTO;
import com.StorySmith.Story_Smith.dto.WikiDTOs.SubcategoryDTO;
import com.StorySmith.Story_Smith.model.WikiModels.WikiCategory;
import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import com.StorySmith.Story_Smith.model.WikiModels.WikiSubcategory;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.repository.ProjectRepository;
import java.util.List;
import java.util.Set;

@Service
public class WikiCategoryService {
    


    @Autowired
    private WikiCategoryRepository wikiCategoryRepository;

    @Autowired
    private WikiSubcategoryRepository wikiSubcategoryRepository;

    @Autowired
    private WikiEntryRepository wikiEntryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private WikiEntryRepository entryRepository;

    @Autowired
    private WikiSubcategoryRepository subcategoryRepository;

    @Transactional
    public void updateCategories(Long projectId, SaveCategoriesPayloadDTO payload) {
        

        //1. Handle categories and cascading deletions
        List<WikiCategory> existingCategories = wikiCategoryRepository.findByProjectId(projectId);

        // Create a set of incoming category IDs for easy lookup and see what was crated, updated, or deleted
        Set<Long> incomingCategoryIds = payload.getCategories().stream()
                .map(categoryDTO -> categoryDTO.getId())
                .collect(java.util.stream.Collectors.toSet());
        
        
        for (WikiCategory existingCat : existingCategories) {
            if(!incomingCategoryIds.contains(existingCat.getId())) {
                // Use this because we don't have a cascade delete set up for subcategories and entries, so we need to manually delete them
                wikiEntryRepository.deleteByCategoryId(existingCat.getId());

                // Delete the category (Subcategories should also be deleted due to cascade delete)
                wikiCategoryRepository.delete(existingCat);
            }
        }

        Map<Long, WikiCategory> savedCategoryMap = new HashMap<>();

        for (CategoryDTO categoryDTO : payload.getCategories()) {
            WikiCategory category;

            //Check if it's an existing category or temporary frontend ID (null or negative)
            System.out.println("Processing category: " + categoryDTO.getName() + " with ID: " + categoryDTO.getId());
            if (categoryDTO.getId() != null && categoryDTO.getId() > 0) {
                category = wikiCategoryRepository.findById(categoryDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));
            } else {
                category = new WikiCategory();
                category.setProject(projectRepository.findById(projectId)
                        .orElseThrow(() -> new RuntimeException("Project not found")));
            }

            category.setName(categoryDTO.getName());
            category.setPosition(categoryDTO.getPosition());

            WikiCategory savedCategory = wikiCategoryRepository.save(category);

            //Map old/incoming ID to the saved category for subcategory processing
            savedCategoryMap.put(categoryDTO.getId(), savedCategory);
        }


        //2. Handle subcategories

        List<WikiSubcategory> existingSubcategories = wikiSubcategoryRepository.findByProjectId(projectId);

        Set<Long> incomingSubIds = payload.getSubcategories().stream()
                .map(subDTO -> subDTO.getId())
                .collect(java.util.stream.Collectors.toSet());

        // Delete subcategories removed on the frontend
        for (WikiSubcategory existingSub : existingSubcategories) {
            if(!incomingSubIds.contains(existingSub.getId())) {
                // 1. Fetch entries attached to this subcategory
                List<WikiEntry> entriesToUnlink = entryRepository.findBySubcategoryId(existingSub.getId());
                
                // 2. Clear the subcategory reference (set it to null)
                for (WikiEntry entry : entriesToUnlink) {
                    entry.setSubcategory(null); 
                    // Or if you store raw IDs: entry.setSubcategoryId(null);
                }
                
                // Save the updated entries so the FK constraint is cleared in the DB
                entryRepository.saveAll(entriesToUnlink);
                
                // Flush changes immediately to guarantee the UPDATE runs before the DELETE
                entryRepository.flush();

                // 3. Now it's safe to delete the subcategory!
                subcategoryRepository.delete(existingSub);
            }
        }

        for (SubcategoryDTO subDto : payload.getSubcategories()) {
            WikiSubcategory subcategory;

            if (subDto.getId() != null && subDto.getId() > 0) {
                subcategory = wikiSubcategoryRepository.findById(subDto.getId())
                        .orElseThrow(() -> new RuntimeException("Subcategory not found"));
            } else {
                subcategory = new WikiSubcategory();
                subcategory.setProject(projectRepository.findById(projectId)
                        .orElseThrow(() -> new RuntimeException("Project not found")));
            }

            subcategory.setName(subDto.getName());
            subcategory.setPosition(subDto.getPosition());

            WikiCategory parentCategory = savedCategoryMap.get(subDto.getCategoryId());
            if (parentCategory == null) {
                throw new RuntimeException("Parent category not found for subcategory");
            } else {
                subcategory.setCategory(parentCategory);
            }

            wikiSubcategoryRepository.save(subcategory);
        }
    }

}
