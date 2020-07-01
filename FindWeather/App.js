'use strict';
import React, {useState, Component } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherLoc from './components/WeatherLoc';
import WeatherCity from './components/WeatherCity';
import CameraScreen from './components/CameraScreen';


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
			onPress={() => { navigation.navigate('Home'); } }
		/>
    </View>
  );
}
function WeatherInputScreen({navigation}) {
	const [city, setCity] = useState('Mumbai');
  const [statename, setStatename] = useState();
  const [country, setCountry] = useState();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Type the name of a city to get the weather!</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mumbai"
        onChangeText={(val) => setCity(val)}
        />
        <TextInput
        style={styles.input}
        placeholder="Statecode (optional)"
        onChangeText={(val) => setStatename(val)}
        />
        <TextInput
        style={styles.input}
        placeholder="Countrycode (optional)"
        onChangeText={(val) => setCountry(val)}
        />
      <Button
        title="Check Weather"
        onPress={() => { navigation.navigate('WeatherCity', {cityname: {city}, statename: {statename}, country:{country} }); } }
      />
    </View>
  );
  }

function WeatherCityScreen({route, navigation}) {
  const { cityname } = route.params;
  const { statename } = route.params;
  const { country } = route.params;
  
  return (
    <View style={styles.container2}>
      <WeatherCity city={cityname} statename={statename} country={country}/>
    <Button
      title="Check Another City"
      onPress={() => { navigation.navigate('Home'); } }
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
