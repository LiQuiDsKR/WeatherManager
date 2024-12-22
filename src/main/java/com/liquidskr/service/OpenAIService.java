package com.liquidskr.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    public String getClothingRecommendation(String weatherJson) {
        RestTemplate restTemplate = new RestTemplate();

        // OpenAI API 요청 본문 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", new Object[] {
                Map.of("role", "system", "content", "당신은 날씨 정보를 기반으로 옷차림을 추천하는 전문가입니다."),
                Map.of("role", "user", "content", "다음 JSON 날씨 정보를 바탕으로 추천 옷차림을 제공해주세요:\n" + weatherJson + "\n" +
                        "외출 할 때 입을 하나의 코디를 작성하는 것이므로, 추천해준 모든 옷을 입고 외출할 수 있음을 전제로 합니다." +
                        "옷 이름, 종류, 설명 등 모든 내용은 한글로 추천합니다." +
                        "옷차림 정보는 반드시 아래와 같은 JSON 문자열 데이터로 전달합니다." +
                        "출력 형식:\n" +
                        "{\n" +
                        "  \"title\": \"추천 코디 제목\",\n" +
                        "  \"description\": \"추천 코디 설명\",\n" +
                        "  \"items\": [\n" +
                        "    {\"name\": \"옷 이름\", \"type\": \"옷 유형\", \"description\": \"옷 설명\"},\n" +
                        "    ... (최소 3개 이상)\n" +
                        "  ]\n" +
                        "}")
        });

        // HTTP 헤더 구성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // HTTP 요청 생성
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // API 호출
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
