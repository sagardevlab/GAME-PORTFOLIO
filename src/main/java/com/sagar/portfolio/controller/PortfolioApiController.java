package com.sagar.portfolio.controller;

import com.sagar.portfolio.dto.ApiResponse;
import com.sagar.portfolio.dto.ContactFormDto;
import com.sagar.portfolio.model.Project;
import com.sagar.portfolio.model.Skill;
import com.sagar.portfolio.model.Trophy;
import com.sagar.portfolio.service.ContactService;
import com.sagar.portfolio.service.PortfolioDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PortfolioApiController {

    private final PortfolioDataService portfolioDataService;
    private final ContactService contactService;

    @GetMapping("/player-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlayerStats() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioDataService.getPlayerStats()));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioDataService.getAllProjects()));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> getProject(@PathVariable String id) {
        return portfolioDataService.getProjectById(id)
                .map(project -> ResponseEntity.ok(ApiResponse.ok(project)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioDataService.getAllSkills()));
    }

    @GetMapping("/skills/{category}")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsByCategory(@PathVariable String category) {
        List<Skill> filtered = portfolioDataService.getAllSkills().stream()
                .filter(s -> s.getCategory().equalsIgnoreCase(category))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(filtered));
    }

    @GetMapping("/trophies")
    public ResponseEntity<ApiResponse<List<Trophy>>> getAllTrophies() {
        return ResponseEntity.ok(ApiResponse.ok(portfolioDataService.getAllTrophies()));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> submitContact(@Valid @RequestBody ContactFormDto dto) {
        boolean success = contactService.processContact(dto);
        if (success) {
            return ResponseEntity.ok(ApiResponse.ok("Message received! Sagar will reply soon. 🎮", null));
        } else {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to send message. Please try again."));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "game", "RUNNING"));
    }
}
