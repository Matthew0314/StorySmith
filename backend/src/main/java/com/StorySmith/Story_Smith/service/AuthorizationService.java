package com.StorySmith.Story_Smith.service;

import com.StorySmith.Story_Smith.model.ProjectCollaborators;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.repository.ProjectCollaboratorsRepository;
import com.StorySmith.Story_Smith.repository.ProjectRepository;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {


    private final ProjectService projectService;
    private final ProjectCollaboratorsRepository projectCollaboratorsRepository;
    private final ProjectRepository projectRepository;

    public AuthorizationService(ProjectService projectService, ProjectCollaboratorsRepository projectCollaboratorsRepository, ProjectRepository projectRepository) {
        this.projectService = projectService;
        this.projectCollaboratorsRepository = projectCollaboratorsRepository;
        this.projectRepository = projectRepository;
    }

    public Boolean userHasAccessToProject(Long projectId, Long userId) {
        // Check if the user is the owner of the project
        Projects project = projectRepository.findById(projectId).orElse(null);
        if (project != null && project.getOwner().getId().equals(userId)) {
            return true;
        }

        if (project != null) {
            // Check if the user is a collaborator on the project
            List<ProjectCollaborators> collaborators = projectCollaboratorsRepository.findListByProjectIdAndUserId(projectId, userId);
            if (!collaborators.isEmpty()) {
                return true;
            }
        }
        return false;
    }

    public Boolean userIsOwnerOfProject(Long projectId, Long userId) {
        Projects project = projectRepository.findById(projectId).orElse(null);
        if (project != null && project.getOwner().getId().equals(userId)) {
            return true;
        }
        return false;
    }
}
