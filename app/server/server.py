from flask import Flask, request, jsonify, send_from_directory
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configurăm folderul pentru încărcarea imaginilor
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    data = request.form
    name = data.get('name')
    age = data.get('age')  # Obținem vârsta din corpul cererii
    cause = data.get('cause')  # Obținem cauza din corpul cererii
    image = request.files.get('image')  # Obținem imaginea încărcată
    if name:
        person_id = len(persons) + 1
        # Verificăm dacă a fost încărcată o imagine și o salvăm
        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        person = {'id': person_id, 'name': name, 'age': age, 'cause': cause, 'image': filename if image else None}  # Adăugăm vârsta, cauza și numele imaginii în dicționarul persoanei
        persons[person_id] = person
        save_data()  # Salvăm datele actualizate
        return jsonify({'message': 'Person added successfully', 'person': person}), 201
    else:
        return jsonify({'error': 'Name is required'}), 400

@app.route('/get_person_list', methods=['GET'])
def get_person_list():
    load_data()  # Încărcăm datele actuale din fișier înainte de a returna lista de persoane
    return jsonify({'personList': list(persons.values())})

@app.route('/delete_person', methods=['GET'])
def delete_person():
    person_id = request.args.get('person_id')
    if person_id:
        person_id = int(person_id)
        print(persons)
        # Verificăm dacă ID-ul persoanei există în dicționarul persons
        if str(person_id) in persons:
            del persons[str(person_id)]
            save_data()  # Salvăm datele actualizate
            return jsonify({'message': f'Person with ID {person_id} deleted successfully'}), 200
        else:
            return jsonify({'error': 'Person not found'}), 404
    else:
        return jsonify({'error': 'Person ID is required in query parameter'}), 400

@app.route('/uploads/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)), debug=True)
