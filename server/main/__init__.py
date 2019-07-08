from flask import Flask
app = Flask(__name__)

from main import misc
model, graph, categories = misc.load()

from main import routes