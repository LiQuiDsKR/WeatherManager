package com.liquidskr.controller;

import com.liquidskr.service.UltravioletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UltraVioletController {

    private final UltravioletService ultravioletService;

    public UltraVioletController(UltravioletService ultravioletService) {
        this.ultravioletService = ultravioletService;
    }

    @PostMapping("/ultraviolet")
    public ResponseEntity<String> getUltravioletRecommendation(@RequestBody String weatherJson) {
        String response = ultravioletService.getUltravioletRecommendation(weatherJson);
        return ResponseEntity.ok(response);
    }
}
