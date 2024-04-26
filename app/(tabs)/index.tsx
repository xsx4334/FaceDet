import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function TabTwoScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [faces, setFaces] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    function toggleCameraType() {
        setType(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
    }

    const handleFacesDetected = ({ faces }: { faces: any[] }) => {
        setFaces(faces);
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

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
          <Camera style={styles.camera} type={type} onFacesDetected={handleFacesDetected}>
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
        top: 20,
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
