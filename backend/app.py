import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from oauth import OAuthSignIn
from jwt_util import encodeJWT, decodeJWT
import controller


app = Flask(__name__, static_url_path='/uploads')
CORS(app, resources = { r"/api/*": { "origins": "*" } })

# Login using OAuth2
@app.route('/api/authorize/<provider>/', methods=['POST'])
def oauth_authorize(provider):
    user_token = request.json['token']
    
    # Get corresponding provider to check user.
    oauth = OAuthSignIn.get_provider(provider)

    # Authorize user and get social ID with provider prefix
    social_id = oauth.authorize(user_token)
    
    # Check if authorization process success
    if not social_id:
        return jsonify({'error': 'Unable to verify'}), 401
    
    # Check if corresponding user account exist in database
    if not controller.registered_social_id(social_id):
        controller.create_new_account(social_id)

    jwt = encodeJWT(social_id)
    
    return jsonify({'jwt': jwt}), 200

# Get user profile with jwt
@app.route('/api/user/profile', methods=['GET'])
def user_profile():
    jwt = request.headers['Authorization']

    # Decode jwt to get social_id
    social_id = None
    try:
        social_id = decodeJWT(jwt)
    except Exception as e:
        return jsonify({"error": "Invalid jwt"}), 400

    # Get user account from database with social_id
    user = controller.get_user_account(social_id)


    if user == None:
        return jsonify({'error': "User not found"}), 404

    return jsonify({'user': user}), 200

    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/file_upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    
    static_path = None
    try:
        static_path = controller.upload_file(file)    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    return jsonify({'url': static_path}), 200

@app.route('/api/uploads/<filename>')
def static_dir(filename):
    return send_from_directory('uploads', filename)

# print(encodeJWT('this is my id'))

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    app.run(debug=True)