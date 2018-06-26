from flask import Flask, render_template, Response
from flask_socketio import SocketIO
from keras.models import model_from_json

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def home():
    resp = Response(render_template('home.html'))
    # Disable cache for ease of debugging.
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp

@socketio.on_error_default
def default_error_handler(e):
    print(e)

@socketio.on('message')
def handle_string(string):
    print('received string: ' + str(string))
    socketio.emit('result', 10)

def predict_from_image(image):
    with open ('model.json','r') as f:
        model = model_from_json(f.read())
    model.load_weights('weights.h5')



if __name__ == '__main__':
    socketio.run(app, debug=True)
