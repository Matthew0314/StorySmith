package com.StorySmith.Story_Smith.repository;

import org.springframework.stereotype.Repository;

import com.StorySmith.Story_Smith.model.ProjectCollaborators;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
@Repository
public interface ProjectCollaboratorsRepository extends JpaRepository<ProjectCollaborators, Long> {
    

    List<ProjectCollaborators> findByProjectId(Long projectId);

    ProjectCollaborators findByProjectIdAndUserId(Long projectId, Long userId);

     void deleteByProjectIdAndUserId(Long projectId, Long userId);

     List<ProjectCollaborators> findListByProjectIdAndUserId(Long projectId, Long userId);
}
