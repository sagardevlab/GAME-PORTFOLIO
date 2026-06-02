package com.sagar.portfolio.service;

import com.sagar.portfolio.model.Project;
import com.sagar.portfolio.model.Skill;
import com.sagar.portfolio.model.Trophy;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PortfolioDataService {

    @Cacheable("projects")
    public List<Project> getAllProjects() {
        return List.of(
            Project.builder()
                .id("webgen-ai")
                .title("WebGen AI Platform")
                .description("LLM-driven code generation workflows. Generates full-stack web apps from natural language prompts.")
                .longDescription("An AI-powered platform that leverages Large Language Models to automate code generation workflows. Supports multi-step prompt chaining, template rendering, and full-stack project scaffolding — all from a single natural language description.")
                .icon("🤖")
                .color("#7c3aed")
                .techStack(List.of("Java 17", "Spring Boot", "LLM APIs", "Thymeleaf", "Maven"))
                .githubUrl("https://github.com/sagardevlab/WebGen-AI-Platform")
                .status("LIVE")
                .category("AI")
                .stars(0)
                .year("2024")
                .build(),

            Project.builder()
                .id("quicknotes")
                .title("QuickNotes")
                .description("Web app for taking quick notes while watching courses or technical videos/blogs — stay in flow.")
                .longDescription("A lightweight, distraction-free note-taking web app designed for developers who learn by doing. Built to keep notes side-by-side with any course or video, with instant save and minimal UI so you never lose focus.")
                .icon("📝")
                .color("#059669")
                .techStack(List.of("HTML5", "CSS3", "JavaScript", "LocalStorage"))
                .githubUrl("https://github.com/sagardevlab/QuickNotes")
                .status("LIVE")
                .category("FULLSTACK")
                .stars(0)
                .year("2024")
                .build(),

            Project.builder()
                .id("cicd-pro")
                .title("Build CI/CD Like A Pro")
                .description("Comprehensive CI/CD pipeline study notes — advanced patterns, deep dives on Jenkins, GitHub Actions, Docker, and best practices.")
                .longDescription("An in-depth knowledge repository covering modern CI/CD best practices. Contains pipeline design patterns, multi-stage Docker builds, GitHub Actions workflows, Jenkins pipelines, Kubernetes deployments, and real-world examples from enterprise setups.")
                .icon("⚙️")
                .color("#d97706")
                .techStack(List.of("Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Nginx"))
                .githubUrl("https://github.com/sagardevlab/Build-CI-CD-LIKE-A-PRO")
                .status("LIVE")
                .category("DEVOPS")
                .stars(0)
                .year("2024")
                .build(),

            Project.builder()
                .id("core-java")
                .title("CoreJava JAVA 17")
                .description("Personal notes on Java fundamentals and Java 17 features — records, sealed classes, pattern matching, text blocks, and more.")
                .longDescription("A curated collection of Java 17 fundamentals, covering core language features, JVM internals, concurrency, streams, new API additions, and hands-on code examples. Built as a personal reference while mastering modern Java at SAP Labs.")
                .icon("☕")
                .color("#b45309")
                .techStack(List.of("Java 17", "JVM", "Maven", "JUnit 5"))
                .githubUrl("https://github.com/sagardevlab/CoreJava-JAVA-17")
                .status("LIVE")
                .category("BACKEND")
                .stars(0)
                .year("2023")
                .build(),

            Project.builder()
                .id("game-portfolio")
                .title("Game Portfolio")
                .description("This very site! A retro RPG-style portfolio built as a 2D side-scroller. Navigate zones, enter buildings, discover skills and projects.")
                .longDescription("A unique developer portfolio built as a 2D Mario-style game. Recruiters navigate a pixel-art world map, entering buildings to explore Projects, Skills, Trophies, and Contact zones. Built with Java 17, Spring Boot 3, Thymeleaf, and a custom HTML5 Canvas game engine — no frameworks, pure JavaScript.")
                .icon("🎮")
                .color("#0ea5e9")
                .techStack(List.of("Java 17", "Spring Boot 3", "Thymeleaf", "HTML5 Canvas", "Web Audio API"))
                .githubUrl("https://github.com/sagardevlab/game-portfolio")
                .status("LIVE")
                .category("FULLSTACK")
                .stars(0)
                .year("2025")
                .build()
        );
    }

    @Cacheable("projects")
    public Optional<Project> getProjectById(String id) {
        return getAllProjects().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    @Cacheable("skills")
    public List<Skill> getAllSkills() {
        return List.of(
            // LANGUAGES
            Skill.builder().name("Java").level(92).category("LANGUAGE").icon("☕").color("#ED8B00").xp(9200).rank("LEGENDARY").build(),
            Skill.builder().name("C++").level(70).category("LANGUAGE").icon("⚡").color("#00599C").xp(7000).rank("EPIC").build(),
            Skill.builder().name("JavaScript").level(75).category("LANGUAGE").icon("🟨").color("#F7DF1E").xp(7500).rank("EPIC").build(),
            Skill.builder().name("HTML5 / CSS3").level(80).category("LANGUAGE").icon("🌐").color("#E34F26").xp(8000).rank("EPIC").build(),

            // FRAMEWORKS
            Skill.builder().name("Spring Boot").level(88).category("FRAMEWORK").icon("🍃").color("#6DB33F").xp(8800).rank("LEGENDARY").build(),
            Skill.builder().name("Spring MVC").level(85).category("FRAMEWORK").icon("🍃").color("#6DB33F").xp(8500).rank("LEGENDARY").build(),
            Skill.builder().name("Hibernate / JPA").level(80).category("FRAMEWORK").icon("🗄️").color("#59666C").xp(8000).rank("EPIC").build(),
            Skill.builder().name("Thymeleaf").level(75).category("FRAMEWORK").icon("🌿").color("#005F0F").xp(7500).rank("EPIC").build(),

            // CLOUD
            Skill.builder().name("AWS").level(72).category("CLOUD").icon("☁️").color("#FF9900").xp(7200).rank("EPIC").build(),
            Skill.builder().name("Azure").level(65).category("CLOUD").icon("🔵").color("#0078D4").xp(6500).rank("RARE").build(),
            Skill.builder().name("Vercel").level(70).category("CLOUD").icon("▲").color("#000000").xp(7000).rank("EPIC").build(),

            // DEVOPS
            Skill.builder().name("Docker").level(80).category("DEVOPS").icon("🐳").color("#0db7ed").xp(8000).rank("EPIC").build(),
            Skill.builder().name("Kubernetes").level(65).category("DEVOPS").icon("☸️").color("#326CE5").xp(6500).rank("RARE").build(),
            Skill.builder().name("Jenkins").level(75).category("DEVOPS").icon("🤵").color("#D33833").xp(7500).rank("EPIC").build(),
            Skill.builder().name("GitHub Actions").level(78).category("DEVOPS").icon("🔄").color("#2671E5").xp(7800).rank("EPIC").build(),
            Skill.builder().name("Nginx").level(68).category("DEVOPS").icon("🔧").color("#009639").xp(6800).rank("RARE").build(),

            // DATABASE
            Skill.builder().name("PostgreSQL").level(78).category("DATABASE").icon("🐘").color("#316192").xp(7800).rank("EPIC").build(),
            Skill.builder().name("MongoDB").level(72).category("DATABASE").icon("🍃").color("#4EA94B").xp(7200).rank("EPIC").build(),
            Skill.builder().name("DynamoDB").level(65).category("DATABASE").icon("⚡").color("#FF9900").xp(6500).rank("RARE").build(),

            // TOOLS
            Skill.builder().name("Git / GitHub").level(90).category("TOOLS").icon("🐙").color("#F05032").xp(9000).rank("LEGENDARY").build(),
            Skill.builder().name("Maven").level(82).category("TOOLS").icon("📦").color("#C71A36").xp(8200).rank("LEGENDARY").build(),
            Skill.builder().name("Jira").level(75).category("TOOLS").icon("🎯").color("#0A0FFF").xp(7500).rank("EPIC").build(),
            Skill.builder().name("SonarQube").level(70).category("TOOLS").icon("🔍").color("#4E9BCD").xp(7000).rank("EPIC").build(),
            Skill.builder().name("Splunk").level(65).category("TOOLS").icon("📊").color("#000000").xp(6500).rank("RARE").build()
        );
    }

    @Cacheable("trophies")
    public List<Trophy> getAllTrophies() {
        return List.of(
            Trophy.builder()
                .id("sap-dev")
                .title("SAP Warrior")
                .description("Software Developer at SAP Labs India — one of the most prestigious tech companies in the world.")
                .icon("⚔️")
                .rarity("PLATINUM")
                .earnedAt("2023")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("btech")
                .title("Scholar of the Realm")
                .description("B.Tech in Computer Science & Engineering — mastered the fundamentals of the digital kingdom.")
                .icon("🎓")
                .rarity("GOLD")
                .earnedAt("2023")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("java-17")
                .title("Java Archmage")
                .description("Mastered Java 17 including records, sealed classes, pattern matching, and virtual threads.")
                .icon("☕")
                .rarity("GOLD")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("spring-master")
                .title("Spring Boot Champion")
                .description("Built and deployed production Spring Boot 3 applications with full CI/CD pipelines.")
                .icon("🍃")
                .rarity("GOLD")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("cicd-pro")
                .title("Pipeline Architect")
                .description("Designed and documented enterprise-grade CI/CD pipelines using Jenkins, GitHub Actions, and Docker.")
                .icon("⚙️")
                .rarity("SILVER")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("cloud-explorer")
                .title("Cloud Explorer")
                .description("Deployed workloads on AWS and Azure — earned the Cloud Explorer badge.")
                .icon("☁️")
                .rarity("SILVER")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("ai-builder")
                .title("AI Tinkerer")
                .description("Built an LLM-driven code generation platform — early adopter of AI-assisted development workflows.")
                .icon("🤖")
                .rarity("GOLD")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("open-source")
                .title("Open Source Hero")
                .description("Published multiple open-source repositories on GitHub for the community to learn from.")
                .icon("🌍")
                .rarity("BRONZE")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("k8s-explorer")
                .title("Kubernetes Navigator")
                .description("Orchestrated containerised workloads with Kubernetes — still charting the territories.")
                .icon("☸️")
                .rarity("SILVER")
                .earnedAt("2024")
                .unlocked(true)
                .build(),

            Trophy.builder()
                .id("game-dev")
                .title("Game Developer")
                .description("Built a fully functional 2D game engine in vanilla JavaScript for this very portfolio!")
                .icon("🎮")
                .rarity("PLATINUM")
                .earnedAt("2025")
                .unlocked(true)
                .build()
        );
    }

    public Map<String, Object> getPlayerStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("name", "Sagar Mehla");
        stats.put("title", "Software Developer @ SAP Labs");
        stats.put("location", "Bengaluru, India 🇮🇳");
        stats.put("level", 17);
        stats.put("xp", 8750);
        stats.put("maxXp", 10000);
        stats.put("github", "https://github.com/sagardevlab");
        stats.put("linkedin", "https://www.linkedin.com/in/sagarmehla/");
        stats.put("email", "sagar.dev.lab@gmail.com");
        stats.put("projectCount", getAllProjects().size());
        stats.put("skillCount", getAllSkills().size());
        stats.put("trophyCount", getAllTrophies().size());
        return stats;
    }
}
