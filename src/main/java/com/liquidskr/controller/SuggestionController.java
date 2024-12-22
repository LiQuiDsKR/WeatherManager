package com.liquidskr.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private static final String FILE_PATH = "data/suggestions.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 건의사항 목록 조회
    @GetMapping
    public List<Map<String, Object>> getSuggestions() throws IOException {
        return readSuggestionsFromFile();
    }

    // 새 건의사항 추가
    @PostMapping
    public Map<String, Object> addSuggestion(@RequestBody Map<String, Object> suggestion) throws IOException {
        List<Map<String, Object>> suggestions = readSuggestionsFromFile();

        suggestion.put("timestamp", LocalDateTime.now().toString());
        suggestion.put("replied", false);
        suggestion.put("replyContent", null);
        suggestion.put("replyTime", null);

        suggestions.add(suggestion);
        writeSuggestionsToFile(suggestions);
        return suggestion;
    }

    // 답변 추가
    @PatchMapping("/{index}")
    public Map<String, Object> replySuggestion(
            @PathVariable int index,
            @RequestBody Map<String, String> replyData
    ) throws IOException {
        List<Map<String, Object>> suggestions = readSuggestionsFromFile();
        if (index < 0 || index >= suggestions.size()) {
            throw new IllegalArgumentException("Invalid suggestion index");
        }

        Map<String, Object> suggestion = suggestions.get(index);
        suggestion.put("replied", true);
        suggestion.put("replyContent", replyData.get("replyContent"));
        suggestion.put("replyTime", LocalDateTime.now().toString());

        writeSuggestionsToFile(suggestions);
        return suggestion;
    }

    // 건의사항 삭제
    @DeleteMapping("/{index}")
    public void deleteSuggestion(@PathVariable int index) throws IOException {
        List<Map<String, Object>> suggestions = readSuggestionsFromFile();
        if (index < 0 || index >= suggestions.size()) {
            throw new IllegalArgumentException("Invalid suggestion index");
        }

        suggestions.remove(index);
        writeSuggestionsToFile(suggestions);
    }

    private List<Map<String, Object>> readSuggestionsFromFile() throws IOException {
        // ClassPathResource를 사용하여 파일 읽기
        File file = new ClassPathResource("data/suggestions.json").getFile();
        if (!file.exists()) {
            System.out.println("JSON 파일이 존재하지 않습니다: " + file.getAbsolutePath());
            return new ArrayList<>();
        }
        System.out.println("JSON 파일 경로: " + file.getAbsolutePath());
        return objectMapper.readValue(file, new TypeReference<>() {});
    }

    private void writeSuggestionsToFile(List<Map<String, Object>> suggestions) throws IOException {
        // ClassPathResource로 파일 접근 (쓰기 권한 확인 필요)
        File file = new ClassPathResource("data/suggestions.json").getFile();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, suggestions);
    }
}
