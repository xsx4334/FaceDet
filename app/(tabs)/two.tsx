import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SERVER_URL = 'http://192.168.100.140:8000';

export default function App() {
    const [persons, setPersons] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [cause, setCause] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        fetchPersons();
    }, []);

    const fetchPersons = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/get_person_list`);
            const data = await response.json();
            setPersons(data.personList);
        } catch (error) {
            console.error('Error fetching person list:', error);
        }
    };

    const handleAddPerson = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('age', age);
            formData.append('cause', cause);
            if (image) {
                const localUri = image;
                const filename = localUri.split('/').pop() || 'image.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';

                const imageFile = {
                    uri: localUri,
                    name: filename,
                    type: type,
                };
                formData.append('image', imageFile);
            }

            const response = await fetch(`${SERVER_URL}/add_person`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            fetchPersons();
        } catch (error) {
            console.error('Error adding person:', error);
        }
    };

    const handleChooseImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            setImage(result.assets[0].uri);

        } catch (error) {
            console.error('Error choosing image:', error);
        }
    };

    const handleDeleteImage = () => {
        setImage(null);
    };

    return (
      <View style={styles.container}>
          <View style={styles.formContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
              />
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
              />
              <Text style={styles.label}>Cause</Text>
              <TextInput
                style={styles.input}
                value={cause}
                onChangeText={setCause}
                placeholder="Enter cause"
              />
          </View>
          <View style={styles.imageContainer}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              {image && <Button title="Delete Image" onPress={handleDeleteImage} />}
          </View>
          <View style={styles.buttonContainer}>
              <Button title="Choose Image" onPress={handleChooseImage} />
              <Button title="Submit" onPress={handleAddPerson} />
          </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        position: 'absolute',
        top: 20,
        width: '85%',
        backgroundColor: 'rgba(132,132,132,0.18)',
        borderRadius: 10,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 0.27,
        shadowRadius: 5.65,
        alignItems: 'center',
    },
    input: {
        borderRadius: 10,
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imageContainer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 0.47,
        shadowRadius: 5.65,
        elevation: 6,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
    },
});
