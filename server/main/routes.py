from main import app, model, graph, categories, preprocess
from flask import render_template, url_for, request, jsonify

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    image = preprocess.process_image(data['image'])

    with graph.as_default():
        predictions = model.predict(image)[0]

    return jsonify({'predictions': predictions.tolist()})


@app.route('/categories', methods=['POST'])
def get_categories():
    return jsonify({'categories': categories})