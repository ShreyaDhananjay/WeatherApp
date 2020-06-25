package com.example.weatherapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
		return restTemplate.getForObject(querystr, String.class);
	  }
	
	/*
	@RequestMapping("/weather2")
	public String weather2() {
		String apiKey = System.getenv("APIKEY");
		String querystr = "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&APPID=" + apiKey;
		return restTemplate.getForObject(querystr, String.class);
	  }
	  */
	@RequestMapping("/weatherfromlocation")
	public String weather3(@RequestParam String lat, @RequestParam String lon) {
		String apiKey = System.getenv("APIKEY");
		String querystr = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + 
						"&APPID=" + apiKey + "&units=metric";
		return restTemplate.getForObject(querystr, String.class);
	}
}
