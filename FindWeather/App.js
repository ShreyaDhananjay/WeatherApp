'use strict';
import React, {useState, Component } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-community/picker';
import WeatherLoc from './components/WeatherLoc';
import WeatherCity from './components/WeatherCity';
import CameraScreen from './components/CameraScreen';
import cities from './cities.json';


class HomeScreen extends Component {
  render(){
    const { navigation } = this.props;
    
  return (
    <View style={styles.container}>
      <Button
        title="Check weather at your location"
        style={styles.button}
        onPress={() => { navigation.navigate('WeatherLoc'); } }
      />
	  <Button
        title="Check weather in another city"
        style={styles.button}
        onPress={() => { navigation.navigate('WeatherInput'); } }
      />
      <Button
        title="Take a picture"
        style={styles.button}
        onPress={() => { navigation.navigate('TakePicture'); } }
      />
    </View>
  );
  } 
}//end of HomeScreen class



function WeatherLocScreen({navigation}) {
  return (
    <View style={styles.container2}>
		<WeatherLoc/>
		<Button
			title="Check Another City"
			onPress={() => { navigation.navigate('WeatherInput'); } }
		/>
    </View>
  );
}
class WeatherInputScreen extends Component {
  state = {
    city: 'Mumbai',
    country: 'India'
  }
  render(){
    const { navigation } = this.props;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select a city to get the weather!</Text>
      <Text style={styles.text}>Country: </Text>
        <Picker
          style={{height: 100, width: 200, fontWeight: 'bold', fontSize: 20, color: 'steelblue'}}
          selectedValue={this.state.country}
          mode="dropdown"
          onValueChange={(itemValue, itemIndex)=>{this.setState({country: itemValue})}}>
          {Object.keys(cities).map((key) => {
              return (<Picker.Item label={key} value={key} key={key}/>) 
          })}
        </Picker>
        <Text style={styles.text}>City: </Text>
        <Picker
          style={{height: 100, width: 200, fontWeight: 'bold', fontSize: 20, color: 'steelblue'}}
          selectedValue={this.state.city}
          mode="dropdown"
          onValueChange={(itemValue, itemIndex)=>{this.setState({city: itemValue})}}>
          {cities[this.state.country].map((item, index) => {
              return (<Picker.Item label={item} value={item} key={index}/>) 
          })}
        </Picker>
      <Button
        title="Check Weather"
        onPress={() => { navigation.navigate('WeatherCity', {cityname: this.state.city, country:this.state.country }); } }
      />
    </View>
  );
  }
}

function WeatherCityScreen({route, navigation}) {
  const { cityname } = route.params;
  const { country } = route.params;
  //console.log(cityname);
  return (
    <View style={styles.container2}>
      <WeatherCity city={cityname} country={country}/>
    <Button
      title="Check Another City"
      onPress={() => { navigation.navigate('WeatherInput'); } }
    />
    </View>
  );
  }
    
function TakePictureScreen(){
  return(
    <View style={styles.container2}>
      <CameraScreen/>
    </View>
  );
}
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'WeatherApp' }}/>
        <Stack.Screen 
        name="WeatherLoc" 
        component={WeatherLocScreen} 
        options={{ title: 'Weather Here' }}/>
		    <Stack.Screen 
        name="WeatherInput" 
        component={WeatherInputScreen} 
        options={{ title: 'Input City' }}/>
        <Stack.Screen 
        name="WeatherCity" 
        component={WeatherCityScreen} 
        options={{ title: 'Weather In City' }}/>
        <Stack.Screen 
        name="TakePicture" 
        component={TakePictureScreen} 
        options={{ title: 'Take a Picture' }}/>
      </Stack.Navigator>
    </NavigationContainer>
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
    text: {
      fontWeight: 'bold',
      fontSize: 30,
      textAlign: 'center',
      color: 'steelblue'
    },
    input: {
      height: 50,
      width: 300,
      fontSize: 25,
      marginTop: 40,
      marginBottom: 20,
      borderColor: 'skyblue',
      borderWidth: 1,
      textAlign: 'center'
    },
    button: {
      marginBottom: 20,
      marginTop: 20,
      height: 50,
      width: 300
    }
});

export default App;
