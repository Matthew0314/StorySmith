package com.StorySmith.Story_Smith.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // Adjust the origin as needed
public class ProjectController {

    @GetMapping("{id}/Owner")
    public String getProjectesOwned(@PathVariable Long id) {

        return new String();
    }

    @GetMapping("{id}/Collaborator")
    public String getProjectsCollaborated(@PathVariable Long id) {
        return new String();
    }



}
