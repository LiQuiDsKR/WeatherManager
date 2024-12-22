package com.liquidskr.service;

import org.aspectj.lang.annotation.RequiredTypes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class UltravioletService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @PostMapping("/ultraviolet")
    public String getUltravioletRecommendation(@RequestBody String weatherJson) {
        RestTemplate restTemplate = new RestTemplate();

        // OpenAI API 요청 본문 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", new Object[] {
                Map.of("role", "system", "content", "당신은 날씨와 자외선 정보를 기반으로 사용자의 피부 건강과 외출 계획을 도와주는 전문가입니다."),
                Map.of("role", "user", "content", "다음 JSON 날씨 정보를 바탕으로 자외선 상태를 분석하고 권장 사항을 한국어 사용자를 위해 한국어로 작성해주세요:\n" +
                        weatherJson + "\n\n" +
                        "출력 형식:\n" +
                        "{\n" +
                        "  \"uvLevel\": \"자외선 상태\",\n" +
                        "  \"recommendation\": \"권장 사항\",\n" +
                        "  \"additionalTips\": \"추가적인 팁\"\n" +
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
            e.printStackTrace();
            throw new RuntimeException("OpenAI API 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
