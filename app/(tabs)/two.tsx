import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SvgXml } from 'react-native-svg';

const uploadIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path
      fill=""
      d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  </svg>
`;

const SERVER_URL = 'http://192.168.100.140:8000';

export default function App() {
    const [persons, setPersons] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [cause, setCause] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);
    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

    useEffect(() => {
        fetchPersons();
    }, []);

    useEffect(() => {
        setShowSubmitButton(image !== null);
    }, [image]);

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
              {image && <TouchableOpacity onPress={handleDeleteImage}><Text>Delete Image</Text></TouchableOpacity>}
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleChooseImage}>
                  <SvgXml xml={uploadIcon} width="50" height="50" />
                  <Text>Choose Image</Text>
              </TouchableOpacity>
              {showSubmitButton && <Button title="Submit" onPress={handleAddPerson} />}
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
        width: 320,
        borderRadius: 12,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        borderRadius: 8,
        height: 40,
        width: '100%',
        backgroundColor: '#1F2937',
        paddingHorizontal: 10,
        color: '#F3F4F6',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#F3F4F6',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
});
