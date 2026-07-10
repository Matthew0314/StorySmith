package com.StorySmith.Story_Smith.service;

import org.springframework.stereotype.Service;
import com.StorySmith.Story_Smith.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.UserRole;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public String register(User user) {
        
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }

        user.setRole(UserRole.USER);

        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
        return "User registered successfully";
    }
}
