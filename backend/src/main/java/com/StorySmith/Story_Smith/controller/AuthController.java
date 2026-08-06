package com.StorySmith.Story_Smith.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import com.StorySmith.Story_Smith.service.UserService;
import com.StorySmith.Story_Smith.security.JwtUtil;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.dto.LoginRequestDTO;
import com.StorySmith.Story_Smith.dto.UserSearchDTO;

import java.util.Map;
import java.util.List;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private com.StorySmith.Story_Smith.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.StorySmith.Story_Smith.service.WikiEntryService wikiEntryService;


    // Registers a new user and returns a success message or error message
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Call the register method in UserService to handle registration logic
        return userService.register(user);
    }

    // Handles user login and returns a JWT token along with user details
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        // Call the login method in UserService to handle authentication logic
        return userService.login(loginRequest);
    }
    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {

    //     // Authenticate the user using email and password
    //     User user = userRepository.findByEmail(loginRequest.getEmail()); // Ensure getter is used

    //     // Check if user exists and password matches
    //     if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
    //         return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    //     }

    //     // Generate JWT token for the authenticated user
    //     String token = JwtUtil.generateToken(user);
        
    //     // Create a structured map matching your frontend's AuthResponse interface
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("token", token);
    //     response.put("id", user.getId());
    //     response.put("username", user.getUsername());
    //     response.put("email", user.getEmail());
    //     response.put("role", user.getRole()); 
    //     response.put("profileUrl", user.getProfileUrl()); 
    //     return ResponseEntity.ok(response);
    // }


    // Endpoint to search for users based on a query string and project ID
    @GetMapping("/members/search")
    public List<UserSearchDTO> searchUsers(@RequestParam Long projectId, @RequestParam String query) {
        // Call the searchUsers method in UserService to perform the search
        return userService.searchUsers(projectId, query);
    }

    // Endpoint to update user information, including profile URL and name
    @PutMapping("/update-info")
    public ResponseEntity<?> updateUserInfo(@RequestBody User updatedUser) {
        User existingUser = userRepository.findById(updatedUser.getId()).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());

        if (existingUser.getProfileUrl() != null && !existingUser.getProfileUrl().equals(updatedUser.getProfileUrl())) {

            wikiEntryService.deleteFile(existingUser.getProfileUrl());
        }

            existingUser.setProfileUrl(updatedUser.getProfileUrl());


        userRepository.save(existingUser);
        return ResponseEntity.ok(Map.of("message", "User info updated successfully"));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("profileUrl", user.getProfileUrl());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        return ResponseEntity.ok(response);
    }
}
