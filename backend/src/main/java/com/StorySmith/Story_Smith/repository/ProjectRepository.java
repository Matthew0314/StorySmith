package com.StorySmith.Story_Smith.repository;
import com.StorySmith.Story_Smith.model.Projects;
import java.util.List;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.StorySmith.Story_Smith.model.Projects;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.StorySmith.Story_Smith.model.User;


@Repository
public interface ProjectRepository extends JpaRepository<Projects, Long> {
    
        // @Query(value = "SELECT p.* FROM projects p" +
        //                 " JOIN project_collaborators pu ON p.id = pu.project_id" +
        //                 " WHERE pu.user_id = :userId AND pu.role = 'OWNER'", nativeQuery = true
        // )
        // List<Projects> findOwnedProjectsByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT p.* FROM projects p" +
                    " JOIN project_collaborators pu ON p.id = pu.project_id" +
                    " WHERE pu.user_id = :userId AND p.owner_id = :userId", nativeQuery = true
    )
    List<Projects> findOwnedProjectsByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT p.* FROM projects p" +
                    " JOIN project_collaborators pu ON p.id = pu.project_id" +
                    " WHERE pu.user_id = :userId AND p.owner_id != :userId", nativeQuery = true
    )
    List<Projects> findCollaboratedProjectsByUserId(@Param("userId") Long userId);

    Projects findById(long id);

    // User findOwnerByProjectId(Long id);

    // List<User> findCollaboratorsByProjectId(Long id);

    
}
