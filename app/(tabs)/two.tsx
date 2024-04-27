import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import din expo-image-picker

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
            // Convertim imaginea într-un obiect FormData
            const formData = new FormData();
            formData.append('name', name);
            formData.append('age', age);
            formData.append('cause', cause);
            if (image) {
                // Obținem calea locală a imaginii și o convertim într-un obiect File
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

            // Trimitem cererea POST către server, incluzând și imaginea în FormData
            const response = await fetch(`${SERVER_URL}/add_person`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            fetchPersons(); // Actualizăm lista de persoane după adăugare
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
            console.log(result.assets[0]);
            if (result !== null && result.assets.length > 0) {
                setImage(result.assets[0].uri as string); // Actualizăm starea 'image' cu URI-ul imaginii selectate
            } else {
                console.log('No image selected');
            }

        } catch (error) {
            console.error('Error choosing image:', error);
        }
    };

    const handleDeleteImage = () => {
        setImage(null);
    };

    return (
      <View style={styles.container}>
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
          <Button title="Choose Image" onPress={handleChooseImage} />
          <Button title="Submit" onPress={handleAddPerson} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {image && <Button title="Delete Image" onPress={handleDeleteImage} />}
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
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#eee',
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
    button: {
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});
