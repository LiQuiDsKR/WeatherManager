package com.liquidskr.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SeasonaryFoodService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    public String getSeasonaryFoodRecommendation(String weatherJson) {
        RestTemplate restTemplate = new RestTemplate();

        // OpenAI API 요청 본문 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", new Object[] {
                Map.of("role", "system", "content", "당신은 지역과 날씨 정보를 바탕으로 계절과 건강에 적합한 제철 음식을 추천하는 영양 전문가입니다."),
                Map.of("role", "user", "content", "다음 JSON 날씨 정보를 바탕으로 제철 음식을 추천해주세요:\n" +
                        weatherJson + "\n\n" +
                        "출력 형식:\n" +
                        "{\n" +
                        "  \"title\": \"추천 음식 제목\",\n" +
                        "  \"description\": \"설명\",\n" +
                        "  \"foods\": [\n" +
                        "    {\"name\": \"음식 이름\", \"benefit\": \"효능\"},\n" +
                        "    ...\n" +
                        "  ]\n" +
                        "}")
        });

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("Request Body: " + requestBody);
            System.out.println("Headers: " + headers);

            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("OpenAI API 응답 오류: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("OpenAI API 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
