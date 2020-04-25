from flask import Flask
from flask_cors import CORS, cross_origin


def create_app():
    app = Flask(__name__)
    cors = CORS(app)

    with app.app_context():
        from . import server
        app.register_blueprint(server.app)

        return app