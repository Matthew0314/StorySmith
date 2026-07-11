package com.StorySmith.Story_Smith.repository;
import com.StorySmith.Story_Smith.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>   {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    User findByEmail(String email);

    User findUserById(Long id);

    // @Query("""
    //     SELECT u
    //     FROM User u
    //     WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
    //     OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
    //     """)
    // List<User> searchUsers(String query);

    @Query("""
        SELECT u
        FROM User u
        WHERE (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        AND NOT EXISTS (
            SELECT 1
            FROM ProjectCollaborators pc
            WHERE pc.user = u
            AND pc.project.id = :projectId
        )
    """)
    List<User> searchUsersNotInProject(@Param("projectId") Long projectId,
                                    @Param("query") String query);
}
