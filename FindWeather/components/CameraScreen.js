'use strict';
import React, {Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as RNFS  from 'react-native-fs';

export default class CameraScreen extends Component{
    state = {
      isCameraVisible: false,
      picturePath: null
    }
    showCameraView = () => {
      this.setState({ isCameraVisible: true });
    } 
    render(){
      return(
        <View>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}/>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
        </View>
      );
    }
    takePicture = async() => {
        if(Platform.OS == "android")
            var url = 'http://10.0.2.2:8082/getimage?imageFile=data:image/jpeg;base64,' ;
            else
            var url = 'http://127.0.0.1:8082/getimage?imagefile=data:image/jpeg;base64,';
      if (this.camera) {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options) 
          .then(data => {
            let base64Img = data.uri;
            console.log(base64Img);
            RNFS.readFile(Platform.OS === 'android'? base64Img.toString().substring(7): base64Img, "base64")
            .then(res => {
                console.log(res);
                var img = res;
                url += img;
                fetch(url).then(res => console.log(res));
                console.log('after fetch');
            })
           })
      }
    }
    
  }//end class

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });
  