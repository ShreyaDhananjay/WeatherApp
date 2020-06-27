package com.example.weatherapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.json.*;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;    

@SpringBootApplication
@RestController
public class WeatherApplication {

	public static void main(String[] args) {
		SpringApplication.run(WeatherApplication.class, args);
	}
	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
   		return builder.build();
	}

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private WeatherRepository weatherRepository;

	
	@RequestMapping("/weather")
	public String weather(@RequestParam String city, @RequestParam(required = false) String statecode, @RequestParam(required=false) String countrycode ) {
		String apiKey = System.getenv("APIKEY");
		String querystr = "https://api.openweathermap.org/data/2.5/weather?q=" + city;
		if(statecode != null) {
			querystr += "," + statecode;
			if(countrycode != null) 
			querystr += "," + countrycode;	
		}
		querystr += "&APPID=" + apiKey + "&units=metric";
		String result = restTemplate.getForObject(querystr, String.class);
		JSONObject w = new JSONObject(result);
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
   		LocalDateTime now = LocalDateTime.now();  
		saveWeather(w, dtf, now);
		return result;
	  }
	
	@RequestMapping("/weatherfromlocation")
	public String weather3(@RequestParam String lat, @RequestParam String lon) {
		String apiKey = System.getenv("APIKEY");
		String querystr = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + 
						"&APPID=" + apiKey + "&units=metric";
		String result = restTemplate.getForObject(querystr, String.class);
		JSONObject w = new JSONObject(result);
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
			LocalDateTime now = LocalDateTime.now();  
		saveWeather(w, dtf, now);
		return result;
	}

	public void saveWeather(JSONObject w, DateTimeFormatter dtf, LocalDateTime now){
		Weather weather= new Weather();
		JSONArray desc = w.getJSONArray("weather");
		JSONObject temps = w.getJSONObject("main");
		JSONObject wind = w.getJSONObject("wind");
		JSONObject y = desc.getJSONObject(0);
		weather.setMain_weather(y.get("main").toString());
		weather.setDescription(y.get("description").toString());
		weather.setTemp(temps.getDouble("temp"));
		weather.setFeels_like(temps.getDouble("feels_like"));
		weather.setTemp_max(temps.getDouble("temp_max"));
		weather.setTemp_min(temps.getDouble("temp_min"));
		weather.setPressure(temps.getDouble("pressure"));
		weather.setHumidity(temps.getDouble("humidity"));
		weather.setWindspeed(wind.getDouble("speed"));
		weather.setCity(w.get("name").toString());
		weather.setDate(dtf.format(now));
		weatherRepository.save(weather);
	}

	@RequestMapping("getweatherlog")
	public @ResponseBody Iterable<Weather> getAllUsers() {
		return weatherRepository.findAll();
	  }
}

