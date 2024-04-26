import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import din expo-image-picker

const SERVER_URL = 'http://10.3.101.94:8000';

export default function App() {
    const [persons, setPersons] = useState<any[]>([]); // Specificăm tipul any pentru persons
    const [name, setName] = useState<string>(''); // Specificăm tipul string pentru name
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
            const response = await fetch(`${SERVER_URL}/add_person`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
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

                setImage(result.assets[0].uri as string); // Actualizăm starea 'image' cu URI-ul imaginii selectate

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
          <Button title="Choose Image" onPress={handleChooseImage} style={styles.button} />
          <Button title="Submit" onPress={handleAddPerson} style={styles.button} />
          <FlatList
            data={persons}
            renderItem={({ item }) => (
              <View style={styles.item}>
                  <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {image && <Button title="Delete Image" onPress={handleDeleteImage} style={styles.button} />}
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
