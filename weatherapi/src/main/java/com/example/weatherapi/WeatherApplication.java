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
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.*;
import java.time.format.DateTimeFormatter;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

	@Autowired
	private ImageRepository imageRepository;

	@Autowired
	private SavedCitiesRepository savedCitiesRepository;

	
	@RequestMapping("/weather")
	public String weather(@RequestParam String city, @RequestParam(required=false) String country ) {
		SavedCities sc = new SavedCities(1, city, country);
		savedCitiesRepository.save(sc);
		String apiKey = System.getenv("APIKEY");
		String querystr = "https://api.openweathermap.org/data/2.5/weather?q=" + city;
		if(country != null) 
		querystr += "," + country;	
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

	@RequestMapping("/deletecity")
	public String deleteCity(@RequestParam String city, @RequestParam String country ) {
		Cities c = new Cities(1,city,country);
		if(savedCitiesRepository.existsById(c))
		{
			savedCitiesRepository.deleteById(c);
			System.out.println("deleted");
			return "deleted";
		}
		else
		return "nothing to delete";
	}

	@RequestMapping("/getweatherlog")
	public @ResponseBody Iterable<Weather> getAllUsers() {
		return weatherRepository.findAll();
	  }

	  @RequestMapping("/getsavedcities")
	  public @ResponseBody Iterable<SavedCities> getAllSavedCities() {
		  return savedCitiesRepository.findAll();
		}

	@RequestMapping(value = "/getimage")
	public @ResponseBody String getimage(@RequestParam("imageFile") String imageValue){
		try{
			System.out.println("in try");
			ImageModel imageModel = new ImageModel();
			byte[] imageByte = Base64.decodeBase64(imageValue);
			System.out.println("before set");
			imageModel.setPicByte(compressBytes(imageByte));
			System.out.println("after set");
			imageRepository.save(imageModel);
			System.out.println("saved image to db");
			return "OK";
		}
		catch(Exception e){
			return "error = " + e;
		}
	}
	public byte[] compressBytes(byte[] data) {
		System.out.println("inside compress bytes");
		Deflater deflater = new Deflater();
		deflater.setInput(data);
		deflater.finish();
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
				byte[] buffer = new byte[1024];
		while (!deflater.finished()) {
			int count = deflater.deflate(buffer);
			outputStream.write(buffer, 0, count);
		}
		try {
			outputStream.close();
		} catch (IOException e) {
			System.out.println(e);
		}
		System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);
		return outputStream.toByteArray();
	}
	
	public static byte[] decompressBytes(byte[] data) {
		Inflater inflater = new Inflater();
		inflater.setInput(data);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
		byte[] buffer = new byte[1024];
		try {
			while (!inflater.finished()) {
				int count = inflater.inflate(buffer);
				outputStream.write(buffer, 0, count);
			}
			outputStream.close();
		} catch (IOException ioe) {
			System.out.println(ioe);
		} catch (DataFormatException e) {
			System.out.println(e);
		}
		return outputStream.toByteArray();
	}
}