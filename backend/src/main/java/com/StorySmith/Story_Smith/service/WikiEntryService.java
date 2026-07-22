package com.StorySmith.Story_Smith.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Map;
import java.util.function.Function;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks.WikiBlock;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryResponseDTO.BlockResponseDTO;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryResponseDTO;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiEntryResponseDTO;
import com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks.WikiBlock;
import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import com.StorySmith.Story_Smith.repository.WikiEntryRepository;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.http.ResponseEntity;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntryComponent;
import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
import com.StorySmith.Story_Smith.repository.WikiEntryComponentRepository;

@Service
public class WikiEntryService {
    
    @Autowired
    private WikiEntryRepository wikiEntryRepository;

    @Autowired
    private WikiEntryComponentRepository wikiEntryComponentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResponseEntity<WikiEntryResponseDTO> getWikiEntryInfo(Long entryId) {
        WikiEntry entry = wikiEntryRepository.findById(entryId).orElse(null);

        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        System.out.println("Fetched WikiEntry: " + entry.getTitle() + " with ID: " + entry.getId());
        System.out.println("Number of components: " + entry.getComponents().size());
        // Convert the WikiEntry entity to a WikiEntryResponseDTO
        return ResponseEntity.ok(new WikiEntryResponseDTO(entry));
    }

    // public ResponseEntity<?> updateWikiEntryInfo(Long entryId, WikiEntryResponseDTO updatedEntry) {
    //     WikiEntry entry = wikiEntryRepository.findById(entryId).orElse(null);

    //     if (entry == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     // Update the entry's title based on the updatedEntry DTO
    //     entry.setTitle(updatedEntry.getTitle());
    //     // Eventually update category and subcategory (This will be done later)

    //     Map<Long, BlockResponseDTO> existingBlockMap = updatedEntry.getBlocks().stream()
    //             .filter(b -> b.getId() != null)
    //             .collect(Collectors.toMap(BlockResponseDTO::getId, Function.identity()));

    //     List<BlockResponseDTO> updatedBlocks = new ArrayList<>();

    //     // 3. Process blocks from request array
    //     for (int index = 0; index < updatedEntry.getBlocks().size(); index++) {
    //         BlockResponseDTO blockDto = updatedEntry.getBlocks().get(index);

    //         BlockResponseDTO blockEntity;

    //         // Check if this is an existing block in the database
    //         // (Filters out JavaScript client Date.now() temp IDs by verifying against existingBlockMap)
    //         if (blockDto.getId() != null && existingBlockMap.containsKey(blockDto.getId())) {
    //             blockEntity = existingBlockMap.get(blockDto.getId());
    //         } else {
    //             // New block creation
    //             blockEntity = new BlockResponseDTO();
    //         }

    //         // Sync properties
    //         blockEntity.setType(blockDto.getType());
    //         blockEntity.setPosition(index); // Guarantee strict 0, 1, 2... order sequence
    //         blockEntity.setData(blockDto.getData()); // Stored as JSONB/TEXT/Map
    //         blockEntity.setWikiEntry(entry);

    //         updatedBlocks.add(blockEntity);
    //     }

    //     // 4. Updating the collection triggers orphanRemoval for any removed blocks
    //     entry.getComponents().clear();
    //     entry.getComponents().setAll(updatedBlocks);


    //     wikiEntryRepository.save(entry);

    //     return ResponseEntity.ok(new WikiEntryResponseDTO(entry));
    // }

    // public ResponseEntity<WikiEntryResponseDTO> updateWikiEntryInfo(Long entryId, WikiEntryResponseDTO updatedEntry) {
    //     WikiEntry entry = wikiEntryRepository.findById(entryId).orElse(null);

    //     if (entry == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     // Update the entry's title based on the updatedEntry DTO
    //     entry.setTitle(updatedEntry.getTitle());
    //     // Eventually update category and subcategory (This will be done later)

    //     Map<Long, BlockResponseDTO> existingBlockMap = updatedEntry.getBlocks().stream()
    //             .filter(b -> b.getId() != null)
    //             .collect(Collectors.toMap(BlockResponseDTO::getId, Function.identity()));

    //     List<WikiEntryComponent> updatedBlocks = new ArrayList<>();

    //     // 3. Process blocks from request array
    //     for (int index = 0; index < updatedEntry.getBlocks().size(); index++) {
    //         BlockResponseDTO blockDto = updatedEntry.getBlocks().get(index);

    //         WikiEntryComponent blockEntity;

    //         // Check if this is an existing block in the database
    //         // (Filters out JavaScript client Date.now() temp IDs by verifying against existingBlockMap)
    //         if (blockDto.getId() != null && existingBlockMap.containsKey(blockDto.getId())) {
    //             blockEntity = wikiEntryComponentRepository.findById(blockDto.getId()).orElse(new WikiEntryComponent());
    //         } else {
    //             // New block creation
    //             blockEntity = new WikiEntryComponent();
    //         }

    //         // Sync properties
    //         String rawType = blockDto.getType().toUpperCase();
    //         blockEntity.setComponentType(ComponentType.valueOf(rawType));
    //         blockEntity.setPosition(index); // Guarantee strict 0, 1, 2... order sequence
    //         blockEntity.setContentJson(blockDto.getData()); // Stored as JSONB/TEXT/Map
    //         blockEntity.setWikiEntry(entry);

    //         updatedBlocks.add(blockEntity);
    //     }

    //     // 4. Updating the collection triggers orphanRemoval for any removed blocks
    //     entry.getComponents().clear();
    //     entry.setComponents(updatedBlocks);


    //     wikiEntryRepository.save(entry);

    //     return ResponseEntity.ok(new WikiEntryResponseDTO(entry));
    // }

    public ResponseEntity<WikiEntryResponseDTO> updateWikiEntryInfo(Long entryId, WikiEntryResponseDTO updatedEntry) {
        WikiEntry entry = wikiEntryRepository.findById(entryId).orElse(null);

        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the entry's title
        entry.setTitle(updatedEntry.getTitle());

        // 1. Map existing DB component IDs to verify real DB IDs vs client temp IDs
        Set<Long> dbComponentIds = entry.getComponents().stream()
                .map(WikiEntryComponent::getId)
                .collect(Collectors.toSet());

        List<WikiEntryComponent> updatedBlocks = new ArrayList<>();

        // 2. Process blocks from request array
        for (int index = 0; index < updatedEntry.getBlocks().size(); index++) {
            BlockResponseDTO blockDto = updatedEntry.getBlocks().get(index);

            WikiEntryComponent blockEntity;

            // Check if this is an existing block in the database using real DB IDs
            if (blockDto.getId() != null && dbComponentIds.contains(blockDto.getId())) {
                blockEntity = wikiEntryComponentRepository.findById(blockDto.getId())
                        .orElseGet(WikiEntryComponent::new);
            } else {
                // New block creation (handles client-generated temp IDs like Date.now())
                blockEntity = new WikiEntryComponent();
            }

            // Sync properties
            String rawType = blockDto.getType().toUpperCase();
            blockEntity.setComponentType(ComponentType.valueOf(rawType));
            blockEntity.setPosition(index); // Guarantee strict 0, 1, 2... sequence

            // 3. Convert Object data back to a JSON String for storage
            try {
                if (blockDto.getData() != null) {
                    String jsonString = objectMapper.writeValueAsString(blockDto.getData());
                    blockEntity.setContentJson(jsonString);
                } else {
                    blockEntity.setContentJson("{}");
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize block data to JSON string", e);
            }

            blockEntity.setWikiEntry(entry);
            updatedBlocks.add(blockEntity);
        }

        // 4. Update orphan-managed collection safely
        entry.getComponents().clear();
        entry.getComponents().addAll(updatedBlocks);

        WikiEntry savedEntry = wikiEntryRepository.save(entry);

        return ResponseEntity.ok(new WikiEntryResponseDTO(savedEntry));
    }
}
