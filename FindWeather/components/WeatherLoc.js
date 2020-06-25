import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default class WeatherLoc extends Component {
  
	state = {
		isLoading: true,
		error: null,
		temperature: 0,
		feels_like: 0,
		mintemp: 0,
		maxtemp: 0,
		main: null,
		description: null, 
		city: null,
		pressure: 0,
		humidity: 0,
		windspeed: 0
  };
  
	async componentDidMount() {
		if(Platform.OS == "ios")
		{
			if(Geolocation.requestAuthorization('whenInUse'))
			{
				Geolocation.getCurrentPosition(
					position => {
						this.fetchWeather(position.coords.latitude, position.coords.longitude);
					},
					error => {
						this.setState({
							error: 'Error Getting Weather Conditions'
						});
					}
				);
			}
		}
		else
		{
			let granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: "App Geolocation Permission",
					message: "App needs access to your phone's location.",
				}
			);
		
			if (granted === PermissionsAndroid.RESULTS.GRANTED) 
			{
				Geolocation.getCurrentPosition(
					position => {
						this.fetchWeather(position.coords.latitude, position.coords.longitude);
					},
					error => {
						this.setState({
							error: 'Error Getting Weather Conditions'
						});
					}
				);
			}
			 else 
				console.log('Location permission not granted!!!!');
		}
		
	}

	fetchWeather(lat = 25, lon = 25) {
		if(Platform.OS = "android")
		var url = 'http://10.0.2.2:8082/weatherfromlocation?lat=' + lat + "&lon=" + lon;
		else
		var url = 'http://127.0.0.1:8082/weatherfromlocation?lat=' + lat + "&lon=" + lon;
		fetch(url)
			.then(res => res.json())
			.then(json => {
				this.setState({
					temperature: json.main.temp,
					feels_like: json.main.feels_like,
					mintemp: json.main.temp_min,
					maxtemp: json.main.temp_max,
					main: json.weather[0].main,
                	description: json.weather[0].description,
					pressure: json.main.pressure,
					humidity: json.main.humidity,
					windspeed: json.wind.speed,
					city: json.name,
					isLoading: false
				});
			});
	}
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Weather in {this.state.city}:</Text>
				{this.state.isLoading ? <ActivityIndicator/> : (
					<View style={styles.container2}>
						<Text style={styles.text2}>Main: {this.state.main}</Text>
						<Text style={styles.text2}>Description: {this.state.description}</Text>
						<Text style={styles.text2}>Temperature: {this.state.temperature}&#xb0;C</Text>
						<Text style={styles.text2}>Feels Like: {this.state.feels_like}&#xb0;C</Text>
						<Text style={styles.text2}>Minimum: {this.state.mintemp}&#xb0;C</Text>
						<Text style={styles.text2}>Maximum: {this.state.maxtemp}&#xb0;C</Text>
						<Text style={styles.text2}>Pressure: {this.state.pressure} hpa</Text>
						<Text style={styles.text2}>Humidity: {this.state.humidity}%</Text>
						<Text style={styles.text2}>Wind Speed: {this.state.windspeed} m/s</Text>
					</View>
      			)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'flex-start', 
      justifyContent: 'flex-start', 
      marginLeft: 20,
	  marginRight: 20,
    },
    container2: {
      flex: 1, 
	  alignItems: 'flex-start',
	  justifyContent: 'flex-start', 
      marginLeft: 20,
      marginRight: 20,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 30,
      color: 'skyblue'
    },
    text2: {
      fontSize: 20,
      color: 'steelblue'
    },
});
