import json
from flask import Flask, request
from flask_cors import CORS, cross_origin


webserver = Flask(__name__)
cors = CORS(webserver)


@webserver.route('/', methods=['GET'])
def main():
    return 'Welcome to the Flask web server!'


@webserver.route('/test', methods=['GET'])
@cross_origin()
def test_api():
    return json.dumps({"message": "Hello from Flask!"})


if __name__ == '__main__':
    webserver.run(host='0.0.0.0', port=3030, debug=True)
