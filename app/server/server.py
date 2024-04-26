import cv2
import base64
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio)

class FaceDetector:
    def __init__(self):
        self.Trained_data = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
        self.webcam_image = cv2.VideoCapture(0)

    def detect_faces(self):
        while True:
            frame_confirm, frame = self.webcam_image.read()
            grayscaled_image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            face_coordinates = self.Trained_data.detectMultiScale(grayscaled_image)
            for (x, y, width, height) in face_coordinates:
                cv2.rectangle(frame, (x, y), (x+width, y+height), (0, 255, 0), 2)

            _, encoded_frame = cv2.imencode('.jpg', frame)
            encoded_frame = base64.b64encode(encoded_frame)
            sio.emit('frame', encoded_frame)

@sio.on('connect')
def connect(sid, environ):
    print('Client connected')

@sio.on('disconnect')
def disconnect(sid):
    print('Client disconnected')

if __name__ == '__main__':
    face_detector = FaceDetector()
    sio.start_background_task(face_detector.detect_faces)
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 8000)), app)
