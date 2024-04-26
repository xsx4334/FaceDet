import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FaceDetectorMode } from 'expo-face-detector';

export default function TabTwoScreen() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [faces, setFaces] = useState<any[]>([]); // Specificăm tipul datelor pentru faces ca any[]

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const handleFacesDetected = ({ faces }: { faces: any[] }) => { // Specificăm tipul datelor pentru faces ca any[]
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

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} onFacesDetected={handleFacesDetected} faceDetectorSettings={{ mode: FaceDetectorMode.fast }}>
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
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
