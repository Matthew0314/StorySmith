package com.StorySmith.Story_Smith.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.StorySmith.Story_Smith.model.WikiModels.WikiEntry;
import java.util.List;
@Repository
public interface WikiEntryRepository extends JpaRepository<WikiEntry, Long> {
    

    List<WikiEntry> findByProjectIdAndSubcategoryId(Long projectId, Long subcategoryId);

    @Query("SELECT MAX(w.position) FROM WikiEntry w WHERE w.project.id = :projectId AND w.category.id = :categoryId")
    Integer findMaxPositionByProjectIdAndCategoryId(@Param("projectId") Long projectId, @Param("categoryId") Long categoryId);

    List<WikiEntry> findByProjectIdAndCategoryId(Long projectId, Long categoryId);

    void deleteByCategoryId(Long categoryId);

    List<WikiEntry> findBySubcategoryId(Long subcategoryId);
}
