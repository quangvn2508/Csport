import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from Account.oauth import OAuthSignIn
from Account.jwt_util import encodeJWT, decodeJWT
import db.controller as ctl
from Judge.JudgeQueue import JudgeQueue

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
    if not ctl.registered_social_id(social_id):
        ctl.create_new_account(social_id)

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
    user = ctl.get_user_account(social_id)


    if user == None:
        return jsonify({'error': "User not found"}), 404

    return jsonify({'user': user}), 200

# upload a file
@app.route('/api/file_upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    
    static_path = None
    try:
        static_path = ctl.upload_file(file)    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    return jsonify({'url': static_path}), 200

# Create problem
@app.route('/api/problem', methods=['POST'])
def create_problem():
    title = request.json['title']
    statement = request.json['statement']
    testcase_zip_url = request.json['testcase']

    # Create new problem and get id
    problem_id = ctl.create_new_problem(title, statement)

    ctl.extract_testcase(testcase_zip_url, problem_id)

    # Get created problem
    problem = ctl.get_problem(problem_id)

    if problem == None:
        return jsonify({'error': 'Unable to create new problem'}), 400

    return jsonify({'problem': problem}), 200

# Get problem list
@app.route('/api/problems', methods=['GET'])
def get_list_problems():
    problems = ctl.get_list_problems()

    return jsonify({'problems': problems}), 200

# Get a problem from id
@app.route('/api/problem/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    problem = ctl.get_problem(problem_id)

    return jsonify({'problem': problem}), 200

# Submit solution to a problem with id
@app.route('/api/submit/<int:problem_id>', methods=['POST'])
def submit_solution(problem_id):
    jwt = request.headers['Authorization']
    language = request.headers['language']
    
    # Decode jwt to get social_id
    social_id = None
    try:
        social_id = decodeJWT(jwt)
    except Exception as e:
        return jsonify({"error": "Invalid jwt"}), 400

    code = request.files['file']
     
    code_url = None
    try:
        code_url = ctl.upload_file(code)    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    submission_id = ctl.append_submission(social_id, language, code_url, problem_id)

    # Add job to queue
    JudgeQueue.getInstance().add_submission(submission_id)

    return jsonify({'submission_id': submission_id}), 200

# Get a submission
@app.route('/api/submission/<int:submission_id>', methods=['GET'])
def get_submission(submission_id):
    jwt = request.headers['Authorization']

    # Decode jwt to get social_id
    social_id = None
    try:
        social_id = decodeJWT(jwt)
    except Exception as e:
        return jsonify({"error": "Invalid jwt"}), 400
    
    submission = ctl.get_submission(submission_id)

    # Check if submission with id exist
    if submission == None:
        return jsonify({'error': 'submission not found'}), 404
    
    # Check if submission belong to requested user
    if submission['user_id'] != social_id:
        return jsonify({'error': 'You are not allow to view others\' submission'}), 403
    
    return jsonify({'submission': submission}), 200

# Access static uploaded file
@app.route('/api/uploads/<filename>', methods=['GET'])
def static_dir(filename):
    return send_from_directory('uploads', filename)

@app.route('/api/testdb')
def testdb():
    return jsonify({'db': ctl.printdb()}), 200


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    app.run(debug=True)