package com.StorySmith.Story_Smith.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.StorySmith.Story_Smith.service.UserService;
import com.StorySmith.Story_Smith.security.JwtUtil;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.dto.LoginRequestDTO;


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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequest) {

        User user = userRepository.findByEmail(loginRequest.email);

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        if (!passwordEncoder.matches(loginRequest.password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = JwtUtil.generateToken(user.getEmail(), user.getUsername());
        // Implement login logic here
        return ResponseEntity.ok(token);
    }
}
