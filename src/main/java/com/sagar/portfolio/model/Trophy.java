package com.sagar.portfolio.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trophy {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String rarity;    // PLATINUM, GOLD, SILVER, BRONZE
    private String earnedAt;
    private boolean unlocked;
    private String hint;      // shown when locked
}
