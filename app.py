from flask import Flask, render_template, Response
from flask_socketio import SocketIO
from keras.models import model_from_json
import base64
import io
from PIL import Image
import numpy

app = Flask(__name__)
socketio = SocketIO(app)

with open ('model.json','r') as f:
    model = model_from_json(f.read())
model.load_weights('weights.h5')
model._make_predict_function()

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
    socketio.emit('result', predict_from_image(string))

def predict_from_image(image):

    image = image[22:]
    bytes = base64.b64decode(image)

    image_data = base64.b64decode(image)
    image_2 = Image.open(io.BytesIO(image_data))
    image_2.thumbnail((28,28))
    pix = numpy.array(image_2)
    pix = pix[:,:,3].reshape(1,28,28,1)/255
    prediction = model.predict(pix)
    prediction = prediction.reshape(-1)
    prediction = int(numpy.argmax(prediction))
    return prediction












if __name__ == '__main__':
    socketio.run(app, debug=True)
