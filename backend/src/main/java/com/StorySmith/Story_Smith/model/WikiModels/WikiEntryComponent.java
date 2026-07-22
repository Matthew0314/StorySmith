package com.StorySmith.Story_Smith.model.WikiModels;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.StorySmith.Story_Smith.model.WikiModels.components.ComponentType;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonRawValue;

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

    // @JsonRawValue
    // @Column(columnDefinition = "json", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_json", nullable = false)
    private String contentJson; // Stores JSON string directly


    public WikiEntryComponent() {}

    public WikiEntryComponent(WikiEntry entry, int position, ComponentType type, String contentJson) {
        this.wikiEntry = entry;
        this.position = position;
        this.componentType = type;
        this.contentJson = contentJson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WikiEntry getWikiEntry() {
        return wikiEntry;
    }

    public void setWikiEntry(WikiEntry wikiEntry) {
        this.wikiEntry = wikiEntry;
    }

    public ComponentType getComponentType() {
        return componentType;
    }

    public void setComponentType(ComponentType componentType) {
        this.componentType = componentType;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getContentJson() {
        return contentJson;
    }

    public void setContentJson(String contentJson) {
        this.contentJson = contentJson;
    }
}