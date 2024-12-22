package com.liquidskr.controller;

import com.liquidskr.dto.ItemSetDTO;
import com.liquidskr.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/recommend")
    public String recommendClothing(@RequestBody String weatherJson) {
        return recommendationService.getClothingRecommendation(weatherJson);
    }
}
