import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

export default function TabTwoScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [faces, setFaces] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access camera was denied', [{ text: 'OK' }]);
                return;
            }
            setHasPermission(true);
        })();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            (async () => {
                const { status } = await Camera.getPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Permission to access camera was denied', [{ text: 'OK' }]);
                    return;
                }
                const { granted } = await Camera.requestCameraPermissionsAsync();
                if (!granted) {
                    Alert.alert('Permission Denied', 'Permission to access camera was denied', [{ text: 'OK' }]);
                    return;
                }
                setHasPermission(true);
            })();
        }
    }, []);

    function toggleCameraType() {
        setType(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
    }

    const handleFacesDetected = async ({ faces }: { faces: any[] }) => {
        console.log('Faces detected:', faces);
        setFaces(faces);

        // Send request to server when face is detected
        try {
            const photo = await this.camera.takePictureAsync(); // Capture the image
            const formData = new FormData();
            formData.append('photo', {
                uri: photo.uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            // Send the image to the server
            const response = await axios.post('http://192.168.100.140:8000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error sending image to server:', error);
        }
    };

    const renderFaces = () => {
        return faces.map((face, index) => {
            const { bounds } = face;
            return (
              <View
                key={index}
                style={{
                    position: 'absolute',
                    borderColor: 'red',
                    borderWidth: 2,
                    left: bounds.origin.x,
                    top: bounds.origin.y,
                    width: bounds.size.width,
                    height: bounds.size.height,
                }}
              />
            );
        });
    };

    const handleCameraError = (error: any) => {
        Alert.alert('Camera Error', error.message, [{ text: 'OK' }]);
        console.log('Camera Error:', error.message);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={type}
            onFacesDetected={handleFacesDetected}
            onError={handleCameraError}
            ref={ref => {
                this.camera = ref; // Reference to the camera component
            }}
          >
              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                      <Text style={styles.text}>Flip Camera</Text>
                  </TouchableOpacity>
              </View>
              {renderFaces()}
          </Camera>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 40 : 20,
        right: 20,
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
