package com.StorySmith.Story_Smith.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.StorySmith.Story_Smith.model.WikiModels.WikiSubcategory;
import java.util.List;
@Repository
public interface WikiSubcategoryRepository extends JpaRepository<WikiSubcategory, Long> {
    List<WikiSubcategory> findByCategoryId(Long categoryId);

    List<WikiSubcategory> findByProjectId(Long projectId);
    List<WikiSubcategory> findByProjectIdAndCategoryId(Long projectId, Long categoryId);

    WikiSubcategory findByProjectIdAndName(Long projectId, String name);
}
