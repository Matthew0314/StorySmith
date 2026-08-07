package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import com.StorySmith.Story_Smith.model.User;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.UserRole;
import com.StorySmith.Story_Smith.dto.LoginRequestDTO;
import com.StorySmith.Story_Smith.dto.UserSearchDTO;
import com.StorySmith.Story_Smith.security.AuthenticatedUser;

import java.util.HashMap;
import java.util.List;

import com.StorySmith.Story_Smith.service.TelemetryService;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;
import com.StorySmith.Story_Smith.service.AuthorizationService;

import com.StorySmith.Story_Smith.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private TelemetryService telemetryService;


    @Autowired
    private AuthorizationService authorizationService;


    // Register a new user
    public ResponseEntity<String> register(User user) {
        
        // Check if the username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Set the default role for the new user
        user.setRole(UserRole.USER);

        // Encode the password before saving the user
        user.setPassword(encoder.encode(user.getPassword()));

        // Save the user to the database
        createUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // Login an existing user
    public ResponseEntity<?> login(LoginRequestDTO loginRequest) {
        
        // Authenticate the user using email
        User user = userRepository.findByEmail(loginRequest.getEmail());

        // Check if user exists and password matches
        if (user == null) {
            telemetryService.recordEvent(
                TelemetryEventType.USER_LOGIN_FAILED,
                null,
                Map.of(
                    "reason", "Invalid email",
                    "email", loginRequest.getEmail()
                )
            );
            return ResponseEntity.status(401).body("Email is not registered");

        }

        // Check if the password matches
        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            telemetryService.recordEvent(
                TelemetryEventType.USER_LOGIN_FAILED,
                user.getId(),
                Map.of(
                    "reason", "Invalid password",
                    "email", user.getEmail()
                )
            );
            return ResponseEntity.status(401).body("Invalid password");
        }

        // Generate a JWT token for the authenticated user
        String token = JwtUtil.generateToken(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole()); 
        response.put("profileUrl", user.getProfileUrl()); 

        // Record telemetry event for successful login
        telemetryService.recordEvent(
            TelemetryEventType.USER_LOGIN_SUCCESS,
            user.getId(),
            Map.of(
                "email", user.getEmail()
            )
        );

        // Return the response containing the token and user details
        return ResponseEntity.ok(response);
    }


    // Search for users based on a query string and project ID
    public ResponseEntity<List<UserSearchDTO>> searchUsers(Long projectId, String query, AuthenticatedUser authenticatedUser)
    {
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        if (projectId == null) {
            return ResponseEntity.badRequest().build(); // Bad Request
        }

        if (!authorizationService.userHasAccessToProject(projectId, authenticatedUser.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        
        return ResponseEntity.ok(userRepository.searchUsersNotInProject(projectId, query)
                .stream()
                .map(UserSearchDTO::new)
                .toList());
    }


    // Create a new user and record telemetry event
    public User createUser(User user) {
        userRepository.save(user);

        telemetryService.recordEvent(
            TelemetryEventType.USER_REGISTER,
            user.getId(),
            Map.of(
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
            )
        );

        return user;
    }


}
