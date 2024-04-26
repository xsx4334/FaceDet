from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Simulăm o bază de date pentru persoane
persons = []

@app.route('/add_person', methods=['POST'])
def add_person():
    data = request.json
    name = data.get('name')
    if name:
        person = {'id': len(persons) + 1, 'name': name}
        persons.append(person)
        return jsonify({'message': 'Person added successfully', 'person': person}), 201
    else:
        return jsonify({'error': 'Name is required'}), 400

@app.route('/get_person_list', methods=['GET'])
def get_person_list():
    return jsonify({'personList': persons})

@app.route('/delete_person', methods=['GET'])
def delete_person():
    person_id = request.args.get('person_id')
    if person_id:
        person_id = int(person_id)
        for person in persons:
            if person['id'] == person_id:
                persons.remove(person)
                return jsonify({'message': f'Person with ID {person_id} deleted successfully'}), 200
        return jsonify({'error': 'Person not found'}), 404
    else:
        return jsonify({'error': 'Person ID is required in query parameter'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)), debug=True)
