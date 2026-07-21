package com.StorySmith.Story_Smith.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.StorySmith.Story_Smith.dto.CreateProjectDTO;
import com.StorySmith.Story_Smith.model.Projects;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMethod;

import com.StorySmith.Story_Smith.model.ProjectRole;


@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // Adjust the origin as needed
public class ProjectController {

    @Autowired
    private com.StorySmith.Story_Smith.service.ProjectService projectService;

    @Autowired
    private com.StorySmith.Story_Smith.service.ProjectSettingsService projectSettingsService;

    @GetMapping("/{id}/owner")
    public ResponseEntity<List<Projects>> getProjectsOwned(@PathVariable Long id) {
        List<Projects> projects = projectService.GetOwnedProjects(id);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}/collaborator")
    public ResponseEntity<List<Projects>> getProjectsCollaborated(@PathVariable Long id) {
        List<Projects> projects = projectService.GetCollaboratedProjects(id);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<List<Projects>> getAllProjects(@PathVariable Long id) {
        List<Projects> ownedProjects = projectService.GetOwnedProjects(id);
        List<Projects> collaboratedProjects = projectService.GetCollaboratedProjects(id);
        ownedProjects.addAll(collaboratedProjects);
        return ResponseEntity.ok(ownedProjects);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody CreateProjectDTO createProjectDTO) {

        
        return projectService.CreateProject(createProjectDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projects> getProjectById(@PathVariable Long id) {
        Projects project = projectService.GetProjectById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{projectId}/roles/{userId}")
    public ResponseEntity<List<ProjectRole>> getRoleInProject(
            @PathVariable Long projectId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
            projectService.GetUserRoleInProject(projectId, userId)
        );
    }



    @GetMapping("/{id}/projectMembers")
    public ResponseEntity<?> getProjectMembers(@PathVariable Long id) {
        return ResponseEntity.ok(projectSettingsService.GetProjectSettings(id));
    }
    
    


}
