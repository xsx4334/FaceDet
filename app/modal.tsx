import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';

const SERVER_URL = 'http://10.3.101.163:8000';
const { width } = Dimensions.get('window');

export default function App() {
  const [persons, setPersons] = useState<any[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_person_list`);
      const data = await response.json();
      setPersons(data.personList);
      console.log(data);
    } catch (error) {
      console.error('Error fetching person list:', error);
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
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
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
    height: 15220,
    marginVertical: 18,
    marginHorizontal: '87%',
    marginLeft : '1%',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
