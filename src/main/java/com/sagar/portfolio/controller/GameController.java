package com.sagar.portfolio.controller;

import com.sagar.portfolio.service.PortfolioDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class GameController {

    private final PortfolioDataService portfolioDataService;

    @GetMapping("/")
    public String gameWorld(Model model) {
        model.addAttribute("playerStats", portfolioDataService.getPlayerStats());
        return "game";
    }
}
