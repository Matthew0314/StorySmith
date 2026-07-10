package com.StorySmith.Story_Smith.repository;

import org.springframework.stereotype.Repository;

import com.StorySmith.Story_Smith.model.ProjectCollaborators;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ProjectCollaboratorsRepository extends JpaRepository<ProjectCollaborators, Long> {
    
}
