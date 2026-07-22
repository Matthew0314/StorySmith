package com.StorySmith.Story_Smith.repository;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntryComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WikiEntryComponentRepository extends JpaRepository<WikiEntryComponent, Long> {


    Optional<WikiEntryComponent> findById(Long id);
    // Optional<WikiEntryComponent> findById(Long id); // Use this if you want to return an Optional instead


}
