from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

# Funcție pentru a salva datele în fișierul JSON
def save_data():
    with open('./persons.json', 'w') as file:
        json.dump(persons, file)

# Funcție pentru a încărca datele din fișierul JSON
def load_data():
    global persons
    if os.path.exists('./persons.json') and os.path.getsize('./persons.json') > 0:
        with open('./persons.json', 'r') as file:
            persons = json.load(file)
    else:
        persons = {}

# Inițializăm structura de date cu datele din fișierul JSON
load_data()

@app.route('/add_person', methods=['POST'])
def add_person():
    data = request.json
    name = data.get('name')
    if name:
        person_id = len(persons) + 1
        person = {'id': person_id, 'name': name}
        persons[person_id] = person
        save_data()  # Salvăm datele actualizate
        return jsonify({'message': 'Person added successfully', 'person': person}), 201
    else:
        return jsonify({'error': 'Name is required'}), 400

@app.route('/get_person_list', methods=['GET'])
def get_person_list():
    return jsonify({'personList': list(persons.values())})

@app.route('/delete_person', methods=['GET'])
def delete_person():
    person_id = request.args.get('person_id')
    if person_id:
        person_id = int(person_id)
        if person_id in persons:
            del persons[person_id]
            save_data()  # Salvăm datele actualizate
            return jsonify({'message': f'Person with ID {person_id} deleted successfully'}), 200
        else:
            return jsonify({'error': 'Person not found'}), 404
    else:
        return jsonify({'error': 'Person ID is required in query parameter'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)), debug=True)
