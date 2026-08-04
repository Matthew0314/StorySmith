package com.StorySmith.Story_Smith.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.*;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.model.UserRole;
import com.StorySmith.Story_Smith.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17");

    @Autowired
    private UserRepository userRepository;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {

        registry.add(
            "spring.datasource.url",
            postgres::getJdbcUrl
        );

        registry.add(
            "spring.datasource.username",
            postgres::getUsername
        );

        registry.add(
            "spring.datasource.password",
            postgres::getPassword
        );
    }

    @Test
    void shouldFindUserByEmail() {

        User user = new User();

        user.setUsername("M67890");
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setFirstName("Sarah");
        user.setLastName("Smith");
        user.setRole(UserRole.USER);

        userRepository.save(user);


        boolean exists =
            userRepository.existsByEmail("test@test.com");


        assertTrue(exists);
    }
}