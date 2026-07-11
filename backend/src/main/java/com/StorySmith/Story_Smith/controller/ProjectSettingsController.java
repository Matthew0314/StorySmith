package com.StorySmith.Story_Smith.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.StorySmith.Story_Smith.dto.AISettingsDTO;
import com.StorySmith.Story_Smith.dto.ProjectSettingsDTO;
import com.StorySmith.Story_Smith.dto.UserSearchDTO;

import org.springframework.http.ResponseEntity;

import java.util.List;

import com.StorySmith.Story_Smith.service.UserService;



@RestController
@RequestMapping("/api/projects/{projectId}/settings")
@CrossOrigin(origins = "*")
public class ProjectSettingsController {


    @Autowired
    private com.StorySmith.Story_Smith.service.ProjectSettingsService projectsettingsService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ProjectSettingsDTO> getSettings(
            @PathVariable Long projectId
    ) {

        
        return ResponseEntity.ok(projectsettingsService.GetProjectSettings(projectId));
    }
    // public String getSettings(
    //         @PathVariable Long projectId
    // ) {

    //     return "Settings for project " + projectId;
    // }

    @PostMapping("ai")
    public ResponseEntity<?> updateAI(
            @PathVariable Long projectId,
            @RequestBody AISettingsDTO dto) {

        projectsettingsService.updateAI(projectId, dto.isEnabled());

        return ResponseEntity.ok().build();
    }
        


    @PutMapping
    public String updateSettings(
            @PathVariable Long projectId
    ) {

        return "Updated settings for project " + projectId;
    }

    @DeleteMapping
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectsettingsService.deleteProject(projectId));
    }

    @DeleteMapping("/members/{userId}")
    public ResponseEntity<?> removeUser(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(projectsettingsService.removeUser(projectId, userId));
    }

    @PostMapping("/members/{userId}")
    public ResponseEntity<?> addUser(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(projectsettingsService.addUser(projectId, userId));
    }

    

}