package com.liquidskr.controller;

import com.liquidskr.service.SeasonaryFoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SeasonaryFoodController {

    private final SeasonaryFoodService seasonaryFoodService;

    public SeasonaryFoodController(SeasonaryFoodService seasonaryFoodService) {
        this.seasonaryFoodService = seasonaryFoodService;
    }

    @PostMapping("/seasonaryfood")
    public ResponseEntity<String> getSeasonaryFoodRecommendation(@RequestBody String weatherJson) {
        String response = seasonaryFoodService.getSeasonaryFoodRecommendation(weatherJson);
        return ResponseEntity.ok(response);
    }
}
