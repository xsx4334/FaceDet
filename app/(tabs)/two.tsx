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

            if (!result.canceled && 'uri' in result) {
                setImage(result.uri as string); // Folosim operatorul 'as' pentru a converti valoarea la tipul 'string'
            }
        } catch (error) {
            console.error('Error choosing image:', error);
        }
    };

    return (
      <View style={styles.container}>
          <FlatList
            data={persons}
            renderItem={({ item }) => (
              <View style={styles.item}>
                  <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
          <Button title="Add Person" onPress={handleAddPerson} />
          <Button title="Choose Image" onPress={handleChooseImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
});
