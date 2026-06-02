package com.sagar.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private String id;
    private String title;
    private String description;
    private String longDescription;
    private String icon;
    private String color;          // hex accent colour
    private List<String> techStack;
    private String githubUrl;
    private String liveUrl;
    private String status;         // LIVE, IN_PROGRESS, ARCHIVED
    private String category;       // BACKEND, FULLSTACK, DEVOPS, AI
    private int stars;
    private String year;
}
