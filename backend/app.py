import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from oauth import OAuthSignIn
from jwt_util import encodeJWT, decodeJWT

app = Flask(__name__)
CORS(app, resources = { r"/api/*": { "origins": "*" } })

@app.route('/api/authorize/<provider>/', methods=['POST'])
def oauth_authorize(provider):
    user_token = request.json['token']
    
    oauth = OAuthSignIn.get_provider(provider)
    user_id = oauth.authorize(user_token)
    if user_id == None:
        return jsonify({"error": "Unable to varify"}), 401
    
    jwt = encodeJWT(user_id)
    return jsonify({'jwt': jwt}), 200


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    app.run(debug=True)