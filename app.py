from flask import Flask, render_template, Response

app = Flask(__name__)


@app.route('/')
def home():
    resp = Response(render_template('home.html'))
    # Disable cache for ease of debugging.
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


def predict_from_image(image):
    from keras.models import model_from_json
    with open ('model.json','r') as f:
            model = model_from_json(f.read())
    model.load_weights('weights.h5')



if __name__ == '__main__':
    app.run(debug=True, port=5000)
