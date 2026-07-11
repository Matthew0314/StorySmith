package com.StorySmith.Story_Smith.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.StorySmith.Story_Smith.model.ProjectRole;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {
    @Query(value = """
        SELECT COALESCE(MAX(position), 0)
        FROM project_roles
        WHERE project_id = :projectId
        """, nativeQuery = true)
    Integer findMaxPositionByProjectId(@Param("projectId") Long projectId);


    boolean existsByProjectIdAndName(Long projectId, String name);


    ProjectRole findByProjectIdAndName(Long projectId, String name);
}

