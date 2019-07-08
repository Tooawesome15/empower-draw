# pylint: skip-file
from main import app
import tensorflow as tf
from keras.models import load_model
import numpy as np
import os

MODEL_PATH = os.path.join(app.root_path, 'resources', 'model.h5')
MAP_PATH = os.path.join(app.root_path, 'resources', 'doodle_map.npy')

def load():
    graph = tf.get_default_graph()
    model = load_model(MODEL_PATH, custom_objects={"GlorotUniform": tf.keras.initializers.glorot_uniform})
    doodle_map = np.load(MAP_PATH)
    categories = doodle_map.tolist()
    return model, graph, categories