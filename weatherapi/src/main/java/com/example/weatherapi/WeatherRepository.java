package com.example.weatherapi;

import org.springframework.data.repository.CrudRepository;

public interface WeatherRepository extends CrudRepository<Weather, Integer> {
    
}