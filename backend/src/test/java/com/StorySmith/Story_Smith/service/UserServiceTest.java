package com.StorySmith.Story_Smith.service;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.model.UserRole;
import com.StorySmith.Story_Smith.repository.TelemetryRepository;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEvent;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;
import com.StorySmith.Story_Smith.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
    
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    // Creates a mock instance of UserRepository to be used in the test
    @Mock
    private UserRepository userRepository;

    @Mock 
    private TelemetryRepository telemetryRepository;

    @Mock
    private TelemetryService telemetryService;

    @Mock
    private PasswordEncoder encoder;

    // Injects the mock UserRepository into the UserService instance for testing
    @InjectMocks
    private UserService userService;

    // Test for the createUser method in UserService
    @Test
    public void testRegisterUser() {

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastName("User");

        when(userRepository.existsByUsername("testuser"))
                .thenReturn(false);

        when(userRepository.existsByEmail("test@test.com"))
                .thenReturn(false);

        when(encoder.encode("password"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User savedUser = invocation.getArgument(0);
                    savedUser.setId(1L);
                    return savedUser;
                });


        ResponseEntity<String> response = userService.register(user);


        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully", response.getBody());


        assertEquals(UserRole.USER, user.getRole());
        assertEquals("encodedPassword", user.getPassword());


        verify(userRepository, times(1))
                .save(user);

        verify(telemetryService, times(1))
                .recordEvent(
                        eq(TelemetryEventType.USER_REGISTER),
                        eq(1L),
                        anyMap()
                );
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
