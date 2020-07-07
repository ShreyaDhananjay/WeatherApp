package com.example.weatherapi;

import org.springframework.data.repository.CrudRepository;
public interface SavedCitiesRepository extends CrudRepository<SavedCities, Cities>{
    
}