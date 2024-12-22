package com.liquidskr.service;

import com.liquidskr.dto.WeatherDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final String apiKey = "12c38a4fb4c7789a951a5b39ee823355"; // OpenWeatherMap API 키
    private final String apiUrl = "https://api.openweathermap.org/data/2.5/weather";

    public WeatherDTO getWeather(String city) {
        String url = String.format("%s?q=%s&appid=%s&units=metric&lang=kr", apiUrl, city, apiKey);

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, WeatherDTO.class); // WeatherDTO로 JSON 매핑
    }
}
