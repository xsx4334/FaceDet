import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image, Button } from 'react-native';

const SERVER_URL = 'http://192.168.100.140:8000';

export default function App() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_person_list`);
      const data = await response.json();
      const filteredPersons = data.personList.filter(person => person.name);
      setPersons(filteredPersons);
    } catch (error) {
      console.error('Error fetching person list:', error);
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      const response = await fetch(`${SERVER_URL}/delete_person?person_id=${personId}`, {
        method: 'GET',
      });
      fetchPersons();
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const handleOpenModal = (person) => {
    const imageUrl = `${SERVER_URL}/uploads/${person.image}`;
    setSelectedPerson({ ...person, imageUrl });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={persons}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpenModal(item)}>
            <View style={styles.itemContainer}>
              <View style={styles.item}>
                <Text style={styles.nameText}>{item.name}</Text>
                {item.age && <Text style={styles.ageText}>Age: {item.age}</Text>}
                {item.cause && <Text style={styles.causeText}>Cause: {item.cause}</Text>}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => handleDeletePerson(item.id)}>
                    <Text style={styles.deleteButton}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {selectedPerson && (
            <Image
              source={{ uri: `${SERVER_URL}/uploads/${selectedPerson.image}` }}
              style={styles.modalImage}
            />
          )}
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: 5.65,
    elevation: 6,
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
  nameText: {
    bottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ageText: {
    marginLeft: -120,
    top: 15,
    fontSize: 16,
    fontStyle: 'italic',
  },
  causeText: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
