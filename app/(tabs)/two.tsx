import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const SERVER_URL = 'http://10.3.100.74:8000';

export default function App() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

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

  const handleChooseImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel) {
        setImage(response.uri);
      }
    });
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
        keyExtractor={(item) => item.id.toString()}
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
