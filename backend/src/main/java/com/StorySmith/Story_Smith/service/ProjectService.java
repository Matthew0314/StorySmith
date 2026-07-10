package com.StorySmith.Story_Smith.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.repository.ProjectRepository;
import com.StorySmith.Story_Smith.repository.ProjectCollaboratorsRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.StorySmith.Story_Smith.dto.CreateProjectDTO;

import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.repository.UserRepository;
import com.StorySmith.Story_Smith.model.ProjectCollaborators;

import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectCollaboratorsRepository projectCollaboratorsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Projects> GetOwnedProjects(Long userId) {
        return projectRepository.findOwnedProjectsByUserId(userId);
    }

    public List<Projects> GetCollaboratedProjects(Long userId) {
        return projectRepository.findCollaboratedProjectsByUserId(userId);
    }

    @Transactional // 1. Guarantees "All or Nothing" execution
    public ResponseEntity<?> CreateProject(CreateProjectDTO createProjectDTO) {
        try {
            // 2. Safeguard against a bad or missing owner ID
            User user = userRepository.findUserById(createProjectDTO.ownerId);
            if (user == null) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Project creation failed: Owner user not found."));
            }

            // 3. Save the main project entity
            Projects project = projectRepository.save(createProjectDTO.toEntity(user));

            // 4. Save the collaborator relation mapping
            ProjectCollaborators pc = projectCollaboratorsRepository.save(
                new com.StorySmith.Story_Smith.model.ProjectCollaborators(
                    project, 
                    user, 
                    com.StorySmith.Story_Smith.model.ProjectRole.OWNER
                )
            );

            // Return a clean JSON message matching your frontend standards
            return ResponseEntity.ok(Map.of("message", "Project created successfully", "projectId", project.getId()));

        } catch (Exception e) {
            // 5. Catch any unexpected database/system errors gracefully
            // The @Transactional annotation ensures the database rolls back automatically here
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred while creating the project: " + e.getMessage()));
        }
    }
}
