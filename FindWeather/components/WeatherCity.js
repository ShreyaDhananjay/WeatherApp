import React, { useEffect, useState, Component } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, Button, View, Text, Platform } from 'react-native';

export default WeatherCity = ({ city, country }) => {
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    state = {
      error: null,
      temperature: 0,
      feels_like: 0,
      mintemp: 0,
      maxtemp: 0,
      mainweather: null,
      description: null, 
      pressure: 0,
      humidity: 0,
      windspeed: 0
    };
    
        if(Platform.OS = "android")
        var url = 'http://10.0.2.2:8082/weather?city=' + city;
        else
        var url = 'http://127.0.0.1:8082/weather?city=' + city;
        url+="&country=" + country;
        //console.log(country);
        //console.log(city);
        //console.log(url);

        useEffect(() => {
          fetch(url)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
        }, []);

        
        return (
            <View style={styles.container2}>
            <Text style={styles.text}>The weather in {city} is:</Text>
            {isLoading ? <ActivityIndicator/> : (
            <View style={styles.container2}>
              <Text style={styles.text2}>Main: {data.weather[0].main}</Text>
              <Text style={styles.text2}>Description: {data.weather[0].description}</Text>
              <Text style={styles.text2}>Temperature: {data.main.temp}&#xb0;C</Text>
              <Text style={styles.text2}>Feels Like: {data.main.feels_like}&#xb0;C</Text>
              <Text style={styles.text2}>Minimum: {data.main.temp_min}&#xb0;C</Text>
              <Text style={styles.text2}>Maximum: {data.main.temp_max}&#xb0;C</Text>
              <Text style={styles.text2}>Pressure: {data.main.pressure} hpa</Text>
              <Text style={styles.text2}>Humidity: {data.main.humidity}%</Text>
              <Text style={styles.text2}>Wind Speed: {data.wind.speed} m/s</Text>
            </View>
            )}
            </View>
            
        );
    }
    

  
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column',
      marginLeft: 20,
      marginRight: 20
    },
    container2: {
      flex: 1, 
      alignItems: 'flex-start', 
      marginTop: 40,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 100
    },
    text: {
      fontWeight: 'bold',
      fontSize: 30,
      textAlign: 'center',
      color: 'skyblue'
    },
    text2: {
      fontSize: 20,
      color: 'steelblue'
    },
    input: {
      height: 40,
      width: 300,
      fontSize: 25,
      marginTop: 40,
      marginBottom: 20,
      borderColor: 'skyblue',
      borderWidth: 1,
      textAlign: 'center'
    },
});
