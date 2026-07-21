package com.StorySmith.Story_Smith.service;

import com.StorySmith.Story_Smith.dto.ProjectMemberDTO;
import com.StorySmith.Story_Smith.dto.ProjectSettingsDTO;
import com.StorySmith.Story_Smith.dto.RoleDTO;
import com.StorySmith.Story_Smith.model.ProjectCollaborators;
import com.StorySmith.Story_Smith.model.Projects;
import com.StorySmith.Story_Smith.model.User;
import com.StorySmith.Story_Smith.repository.ProjectCollaboratorsRepository;
import com.StorySmith.Story_Smith.repository.ProjectRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.StorySmith.Story_Smith.repository.UserRepository;

import org.springframework.http.ResponseEntity;

import com.StorySmith.Story_Smith.model.ProjectRole;
import com.StorySmith.Story_Smith.repository.ProjectRoleRepository;

import java.util.Comparator;


import java.util.Set;


@Service
public class ProjectSettingsService {


    @Autowired
    private ProjectRepository projectRepository;


    @Autowired
    private ProjectCollaboratorsRepository collaboratorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;


    @Transactional
    public ResponseEntity<?> updateAI(Long projectId, Boolean aiEnabled) {

        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                    new RuntimeException("Project not found")
                );
        project.setUseAI(aiEnabled);


        return ResponseEntity.ok("AI settings updated successfully");
    }

    


    public ResponseEntity<?> deleteProject(Long projectId) {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                    new RuntimeException("Project not found")
                );

        // projectRepository.delete(project);
        project.setDeleted(true);
        projectRepository.save(project);

        return ResponseEntity.ok("Project deleted successfully");
    }

    @Transactional
    public ResponseEntity<?> removeUser(Long projectId, Long userId) {

        ProjectCollaborators pc =
            collaboratorRepository.findByProjectIdAndUserId(projectId, userId);

        System.out.println("Found collaborator: " + (pc != null));

        pc.getRoles().clear();
        System.out.println("Cleared roles");

        collaboratorRepository.saveAndFlush(pc);
        System.out.println("Saved");

        collaboratorRepository.delete(pc);
        System.out.println("Deleted");

        collaboratorRepository.flush();
        System.out.println("Flushed");

        return ResponseEntity.ok("User removed from project successfully");
    }

    @Transactional
    public ResponseEntity<?> addUser(Long projectId, Long userId) {
        // ProjectCollaborators pc = collaboratorRepository.findByProjectIdAndUserId(projectId, userId)
        //         .orElseThrow(() ->
        //             new RuntimeException("Collaboration not found")
        //         );

        // collaboratorRepository.save(pc);

        // ProjectCollaborators pc = new ProjectCollaborators(userRepository.findById(userId)
        //         .orElseThrow(() ->
        //             new RuntimeException("User not found")
        //         ), projectRepository.findById(projectId)
        //         .orElseThrow(() ->
        //             new RuntimeException("Project not found")
        //         ));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found")
                );

        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                    new RuntimeException("Project not found")
                );


        ProjectRole r;
        if (!projectRoleRepository.existsByProjectIdAndName(projectId, "COLLABORATOR")) {
            Integer maxPosition = projectRoleRepository.findMaxPositionByProjectId(projectId);

            r = projectRoleRepository.save(new ProjectRole("COLLABORATOR", project, "#00FF00", maxPosition + 1));
        } else {
            r = projectRoleRepository.findByProjectIdAndName(projectId, "COLLABORATOR");
        }

        ProjectCollaborators pc = collaboratorRepository.save(new ProjectCollaborators(project, user, r));

        return ResponseEntity.ok("User added to project successfully");
    }

    // public ProjectSettingsDTO GetProjectSettings(Long projectId) {


    //     Projects project = projectRepository.findById(projectId)
    //             .orElseThrow(() ->
    //                 new RuntimeException("Project not found")
    //             );


    //     List<ProjectCollaborators> collaborators =
    //             collaboratorRepository.findByProjectId(projectId);



    //     List<ProjectMemberDTO> members = collaborators.stream()
    //             .map(this::convertMember)
    //             .toList();



    //     return new ProjectSettingsDTO(
    //             project.getId(),
    //             project.getName(),
    //             members,
    //             new ArrayList<>(), // roles later
    //             project.getUseAI()
    //     );
    // }

    public ProjectSettingsDTO GetProjectSettings(Long projectId) {

        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                    new RuntimeException("Project not found")
                );


        List<ProjectCollaborators> collaborators =
                collaboratorRepository.findByProjectId(projectId);


        List<ProjectMemberDTO> members = collaborators.stream()
                .map(this::convertMember)
                .toList();


        // Set<ProjectRole> projectRoles = collaborators.stream()
        //         .flatMap(collaborator -> collaborator.getRoles().stream())
        //         .collect(Collectors.toSet());

        List<ProjectRole> projectRoles = collaborators.stream()
            .flatMap(collaborator -> collaborator.getRoles().stream())
            .distinct()
            .sorted(Comparator.comparing(ProjectRole::getPosition))
            .toList();


        List<RoleDTO> roles = projectRoles.stream()
                .map(role -> new RoleDTO(
                        role.getId(),
                        role.getName(),
                        new ArrayList<>()
                ))
                .toList();


        return new ProjectSettingsDTO(
                project.getId(),
                project.getName(),
                members,
                roles,
                project.getUseAI()
        );
    }
        
    private ProjectMemberDTO convertMember(ProjectCollaborators collaborator) {


        User user = collaborator.getUser();


        List<RoleDTO> roles =
                collaborator.getRoles()
                .stream()
                .map(role -> new RoleDTO(
                        role.getId(),
                        role.getName(),
                        new ArrayList<>()
                ))
                .toList();



        return new ProjectMemberDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }

}