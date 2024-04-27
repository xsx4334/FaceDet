import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const SERVER_URL = 'http://192.168.100.140:8000';

export default function App() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_person_list`);
      const data = await response.json();
      // Verificăm dacă fiecare obiect din lista are o proprietate "name"
      const filteredPersons = data.personList.filter(person => person.name);
      setPersons(filteredPersons);
      console.log(data);
    } catch (error) {
      console.error('Error fetching person list:', error);
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      const response = await fetch(`${SERVER_URL}/delete_person?person_id=${personId}`, {
        method: 'GET',
      });
      // Reîncarcăm lista după ștergere
      fetchPersons();
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={persons}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.item}>
              <Text>{item.name}</Text>
              {item.age && <Text>Age: {item.age}</Text>}
              {item.cause && <Text>Cause: {item.cause}</Text>}
              <View style={styles.buttonContainer}>
                {/* Butonul de ștergere */}
                <TouchableOpacity onPress={() => handleDeletePerson(item.id)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
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
  itemContainer: {
    width: '90%',
    marginVertical: 18,
    marginHorizontal: '5%',
  },
  item: {
    width: '100%',
    padding: '7%',
    backgroundColor: '#eee',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
