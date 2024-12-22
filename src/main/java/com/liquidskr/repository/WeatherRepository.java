package com.liquidskr.repository;

import com.liquidskr.dto.WeatherDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class WeatherRepository {

    private final Map<String, WeatherDTO> weatherData = new HashMap<>();

    public WeatherDTO findWeatherByCity(String cityName) {
        return weatherData.get(cityName);
    }

    public void saveWeather(WeatherDTO weatherDTO) {
        weatherData.put(weatherDTO.getCityName(), weatherDTO);
    }
}
