package com.StorySmith.Story_Smith.service;

import com.StorySmith.Story_Smith.repository.ProjectCollaboratorsRepository;
import com.StorySmith.Story_Smith.repository.ProjectRepository;
import com.StorySmith.Story_Smith.repository.ProjectRoleRepository;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.ProjectCollaborators;
import com.StorySmith.Story_Smith.model.ProjectRole;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.model.telemetry.TelemetryEventType;
import com.StorySmith.Story_Smith.dto.CreateProjectDTO;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {
    

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectRoleRepository projectRoleRepository;

    @Mock
    private ProjectCollaboratorsRepository projectCollaboratorsRepository;

    @Mock
    private WikiService wikiService;

    @Mock
    private TelemetryService telemetryService;


    @InjectMocks
    private ProjectService projectService;

    @Test
    void loggedInUserCanCreateProject() {

        // Arrange
        User user = new User();
        user.setId(1L);

        CreateProjectDTO dto = new CreateProjectDTO();
        dto.ownerId = 1L;
        dto.name = "My Story";


        Projects project = dto.toEntity(user);
        project.setId(10L);


        when(userRepository.findUserById(1L))
                .thenReturn(user);


        when(projectRepository.save(any(Projects.class)))
                .thenReturn(project);


        when(projectRoleRepository.save(any(ProjectRole.class)))
                .thenReturn(new ProjectRole());


        when(projectCollaboratorsRepository.save(any(ProjectCollaborators.class)))
                .thenReturn(new ProjectCollaborators());

        doNothing().when(telemetryService)
                .recordEvent(
                        any(TelemetryEventType.class),
                        anyLong(),
                        anyMap()
                );


        // Act
        ResponseEntity<?> response =
                projectService.CreateProject(dto);


        // Assert
        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );


        verify(projectRepository, times(1))
                .save(any(Projects.class));


        verify(projectRoleRepository, times(1))
                .save(any(ProjectRole.class));


        verify(projectCollaboratorsRepository, times(1))
                .save(any(ProjectCollaborators.class));


        verify(wikiService, times(1))
                .setDefaultWikiCategories(project);
    }
}
