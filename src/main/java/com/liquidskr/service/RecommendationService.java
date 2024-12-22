package com.liquidskr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;

    public RecommendationService(OpenAIService openAIService, ObjectMapper objectMapper) {
        this.openAIService = openAIService;
        this.objectMapper = objectMapper;
    }

    public String getClothingRecommendation(String weatherJson) {
        try {
            // OpenAI API 호출
            String openAIResponse = openAIService.getClothingRecommendation(weatherJson);

            // 응답을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(openAIResponse);
            JsonNode contentNode = rootNode.path("choices").get(0).path("message").path("content");

            // content 필드 안의 JSON 문자열을 다시 파싱
            String contentString = contentNode.asText();
            JsonNode contentJson = objectMapper.readTree(contentString);

            // 결과를 문자열로 반환
            return contentJson.toString();

        } catch (Exception e) {
            throw new RuntimeException("추천 데이터를 처리하는 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
