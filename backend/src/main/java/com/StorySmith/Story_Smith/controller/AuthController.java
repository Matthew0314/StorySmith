package com.StorySmith.Story_Smith.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Implement registration logic here

        String result = userService.register(user);

        if (result.equals("User registered successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequest) {

    //     User user = userRepository.findByEmail(loginRequest.email);

    //     if (user == null) {
    //         return ResponseEntity.status(401).body("Invalid email or password");
    //     }

    //     if (!passwordEncoder.matches(loginRequest.password, user.getPassword())) {
    //         return ResponseEntity.status(401).body("Invalid email or password");
    //     }

    //     String token = JwtUtil.generateToken(user);
    //     // Implement login logic here
    //     return ResponseEntity.ok(token);
    // }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail()); // Ensure getter is used

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        String token = JwtUtil.generateToken(user);
        
        // Create a structured map matching your frontend's AuthResponse interface
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole()); // Matches 'roles' string on frontend

        return ResponseEntity.ok(response);
    }

    @GetMapping("/members/search")
    public List<UserSearchDTO> searchUsers(@RequestParam Long projectId, @RequestParam String query) {
        System.out.println("Controller received search request with projectId: " + projectId + " and query: " + query);
        return userService.searchUsers(projectId, query);
    }
}
