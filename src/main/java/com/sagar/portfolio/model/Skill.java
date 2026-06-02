package com.sagar.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    private String name;
    private int level;       // 1-100
    private String category; // LANGUAGE, FRAMEWORK, CLOUD, DEVOPS, DATABASE, TOOLS
    private String icon;     // emoji
    private String color;    // hex colour for the skill bar
    private int xp;          // game-style XP
    private String rank;     // LEGENDARY, EPIC, RARE, COMMON
}
