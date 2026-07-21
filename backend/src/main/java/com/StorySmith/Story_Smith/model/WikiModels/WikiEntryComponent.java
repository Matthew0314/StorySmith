package com.StorySmith.Story_Smith.model.WikiModels;

import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "wiki_entry_components")
public class WikiEntryComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wiki_entry_id", nullable = false)
    @JsonIgnore
    private WikiEntry wikiEntry;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComponentType componentType;

    @Column(nullable = false)
    private Integer position;

    @Column(columnDefinition = "json", nullable = false)
    private String contentJson; // Stores JSON string directly

    public WikiEntryComponent() {
    }

    public WikiEntryComponent(WikiEntry entry, int position, ComponentType type, String data) {
        this.wikiEntry = entry;
        this.position = position;
        this.componentType = type;
        this.contentJson = data;
    }
}