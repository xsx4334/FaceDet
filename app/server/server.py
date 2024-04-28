from flask import Flask, request, jsonify, send_from_directory
import os
import json
from werkzeug.utils import secure_filename
import cv2

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

# Funcție pentru a compara două imagini și a returna gradul de asemănare între ele
def compare_images(image1, image2):
    try:
        # Citirea imaginilor
        img1 = cv2.imread(image1)
        img2 = cv2.imread(image2)

        # Verificăm dacă imaginile au fost citite corect
        if img1 is None or img2 is None:
            print("Una dintre imaginile nu a putut fi citită.")
            return 0

        # Verificăm dacă imaginile sunt goale
        if img1.size == 0 or img2.size == 0:
            print("Una dintre imaginile este goală.")
            return 0

        # Convertirea imaginilor în grayscale
        gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

        # Inițializarea detectorului de caracteristici
        sift = cv2.SIFT_create()

        # Detectarea și descrierea punctelor de interes folosind detectorul SIFT
        kp1, des1 = sift.detectAndCompute(gray1, None)
        kp2, des2 = sift.detectAndCompute(gray2, None)

        # Inițializarea algoritmului de potrivire
        bf = cv2.BFMatcher()

        # Realizarea potrivirii între descriptorii celor două imagini
        matches = bf.knnMatch(des1, des2, k=2)

        # Aplicarea raportului de distanță Lowe pentru a selecta cele mai bune potriviri
        good_matches = []
        for m, n in matches:
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)

        # Calcularea gradului de asemănare
        similarity = len(good_matches) / len(kp1) * 100

        return similarity
    except Exception as e:
        print("Eroare la compararea imaginilor:", str(e))
        return 0

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
            print("Image received successfully:", filename)  # Print message for successful image upload
        else:
            print("No image received for:", name)  # Print message if no image is received
        person = {'id': person_id, 'name': name, 'age': age, 'cause': cause, 'image': filename if image else None}  # Adăugăm vârsta, cauza și numele imaginii în dicționarul persoanei
        persons[person_id] = person
        save_data()  # Salvăm datele actualizate
        return jsonify({'message': 'Person added successfully', 'person': person}), 201
    else:
        return jsonify({'error': 'Name is required'}), 400


@app.route('/analyze', methods=['POST'])
def analyze():
    image = request.files.get('photo')  # Obținem imaginea încărcată
    if image:
        print("Image received for analysis:", image.filename)  # Print message for successful image upload for analysis

        similarity_threshold = 88  # Threshold-ul de similaritate pentru potrivire

        uploaded_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_image.jpg')
        image.save(uploaded_image_path)  # Salvăm imaginea încărcată într-un fișier temporar

        for filename in os.listdir('./uploads'):
            if filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png'):
                filepath = os.path.join('./uploads', filename)
                similarity = compare_images(uploaded_image_path, filepath)
                if similarity >= similarity_threshold:
                    print("GAAAASSSIIITTTT! Imaginea", image.filename, "are o potrivire cu", filename, "cu un grad de similaritate de", similarity, "%")

        os.remove(uploaded_image_path)  # Ștergem fișierul temporar cu imaginea încărcată

        return jsonify({'message': 'Image received for analysis'}), 200
    else:
        print("No image received for analysis")  # Print message if no image is received for analysis
        return jsonify({'error': 'No image received for analysis'}), 400

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
