package com.StorySmith.Story_Smith.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.StorySmith.Story_Smith.model.WikiModels.WikiCategory;

import java.util.List;

@Repository
public interface WikiCategoryRepository extends JpaRepository<WikiCategory, Long> {
    

    List<WikiCategory> findByProjectId(Long projectId);
}
