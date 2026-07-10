package com.StorySmith.Story_Smith.repository;
import com.StorySmith.Story_Smith.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>   {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    User findByEmail(String email);
}
