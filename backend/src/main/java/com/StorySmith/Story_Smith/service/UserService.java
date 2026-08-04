package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import com.StorySmith.Story_Smith.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.UserRole;

import com.StorySmith.Story_Smith.dto.UserSearchDTO;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public ResponseEntity<String> register(User user) {
        
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setRole(UserRole.USER);

        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    public List<UserSearchDTO> searchUsers(Long projectId, String query) {
        return userRepository.searchUsersNotInProject(projectId, query)
                .stream()
                .map(UserSearchDTO::new)
                .toList();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }


}
