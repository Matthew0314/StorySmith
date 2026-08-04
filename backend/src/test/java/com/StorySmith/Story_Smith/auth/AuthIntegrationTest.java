package com.StorySmith.Story_Smith.auth;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.repository.UserRepository;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.web.servlet.MockMvc;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;


import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;



@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class AuthIntegrationTest {


    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private UserRepository userRepository;


    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17");

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
    void shouldRegisterUserSuccessfully() throws Exception {


        mockMvc.perform(
                post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                {
                    "username":"IntegrationUser",
                    "email":"integration@test.com",
                    "password":"password123",
                    "firstName":"Integration",
                    "lastName":"Test"
                }
                """)
        )
        .andDo(print())
        .andExpect(status().isOk());


        User user =
            userRepository.findByEmail("integration@test.com");


        assertTrue(user != null);

    }
}


