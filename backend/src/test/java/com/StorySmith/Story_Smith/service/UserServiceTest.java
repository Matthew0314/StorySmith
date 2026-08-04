package com.StorySmith.Story_Smith.service;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.springframework.http.ResponseEntity;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    // Creates a mock instance of UserRepository to be used in the test
    @Mock
    private UserRepository userRepository;

    // Injects the mock UserRepository into the UserService instance for testing
    @InjectMocks
    private UserService userService;

    // Test for the createUser method in UserService
    @Test
    public void testCreateUser() {

        // Create a sample user object to be used in the test
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        // Mock the behavior of userRepository.save to return the user object when called
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Call the createUser method in UserService
        User createdUser = userService.createUser(user);

        // Verify that the userRepository.save method was called exactly once with the user object
        assertNotNull(createdUser);
        assertEquals("testuser", createdUser.getUsername());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void shouldRejectDuplicateEmail() {

        // Create a sample user object with a duplicate email
        User user = new User();
        user.setUsername("Matthew");
        user.setEmail("test@test.com");
        user.setPassword("password");

        // Mock the behavior of userRepository.existsByUsername and userRepository.existsByEmail
        when(userRepository.existsByUsername("Matthew"))
                .thenReturn(false);

        when(userRepository.existsByEmail("test@test.com"))
                .thenReturn(true);

        // Call the register method in UserService
        // String result = userService.register(user);
        ResponseEntity<?> result = userService.register(user);

        // Verify that the result indicates a duplicate email error
        assertEquals(
            "Email already exists",
            result.getBody()
        );

        // Verify that userRepository.save was never called since the registration should fail
        verify(userRepository, never())
                .save(any(User.class));
    }
}
