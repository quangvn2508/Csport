import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from Account.oauth import OAuthSignIn
from Account.util import encodeJWT, decodeJWT, parse_fb_signed_request
import db.controller as ctl
import db.file_util as ftl
from Judge.JudgeQueue import JudgeQueue
import validation.validation as vld

app = Flask(__name__, static_url_path='/uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app, resources = { r"/api/*": { "origins": "*" } })

# Login using OAuth2
@app.route('/api/authorize/<provider>/', methods=['POST'])
def oauth_authorize(provider):
    try:
        user_token = request.json['token']
    except Exception:
        return 400
    
    # Get corresponding provider to check user.
    oauth = OAuthSignIn.get_provider(provider)

    # Authorize user and get social ID with provider prefix
    social_id = oauth.authorize(user_token)
    
    # Check if authorization process success
    if not social_id:
        return jsonify({'error': 'Unable to verify'}), 401
    
    # Check if corresponding user account exist in database
    if not ctl.registered_social_id(social_id):
        ctl.create_user(social_id)

    user_id = ctl.get_user_id(social_id)

    if user_id is None:
        return jsonify({'error': 'unexpected error'}), 500

    jwt = encodeJWT(user_id)
    
    return jsonify({'jwt': jwt}), 200

# Get user profile with jwt
@app.route('/api/user/profile', methods=['GET'])
def user_profile():
    try:
        jwt = request.headers['Authorization']
    except Exception:
        return 400

    # Decode jwt to get social_id
    user_id, code = decodeJWT(jwt)
    if code == 401:
        return jsonify({'error': 'JWT expired'}), 401

    # Get user account from database with user_id
    user = ctl.get_user(user_id)

    if user == None:
        return jsonify({'error': "User not found"}), 404

    return jsonify({'user': user}), 200

# upload a file
@app.route('/api/file_upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
    except Exception:
        return jsonify({'error': 'Missing/Invalid input'}), 400
    
    try:
        static_path = ftl.upload_file(file)    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    return jsonify({'url': static_path}), 200

# Create problem
@app.route('/api/problem', methods=['POST'])
def create_problem():
    try:
        jwt = request.headers['Authorization']
        title = request.json['title']
        statement = request.json['statement']
        testcase_zip_url = request.json['testcase']

        assert vld.new_post_validation(title, statement, testcase_zip_url)
    except Exception:
        return jsonify({'error': 'Missing/Invalid input'}), 400

    # Decode jwt to get user_id
    user_id, code = decodeJWT(jwt)
    if code == 401:
        return jsonify({'error': 'JWT expired'}), 401

    # Create new problem and get id
    problem_id = ctl.create_problem(user_id, title, statement)

    try:
        ftl.extract_testcase(testcase_zip_url, problem_id)
    except FileNotFoundError:
        return jsonify({'error': 'Testcase URL not recognised'}), 400
    except Exception:
        return jsonify({'error': 'Invalid testcase URL'}), 400

    return jsonify({'problem_id': problem_id}), 200

# Get problem list
@app.route('/api/problems', methods=['GET'])
def get_list_problems():
    problems = ctl.get_problems_all()

    return jsonify({'problems': problems}), 200

# Get a problem from id
@app.route('/api/problem/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    problem = ctl.get_problem(problem_id)

    return jsonify({'problem': problem}), 200

# Submit solution to a problem with id
@app.route('/api/submit/<int:problem_id>', methods=['POST'])
def submit_solution(problem_id):
    try:
        jwt = request.headers['Authorization']
        language = request.headers['language']
        code_file = request.files['file']

        assert vld.new_submission_validation(language)
    except Exception:
        return jsonify({'error': 'Missing/Invalid input'}), 400
    
    # Decode jwt to get user_id
    user_id, code = decodeJWT(jwt)
    if code == 401:
        return jsonify({'error': 'JWT expired'}), 401

    try:
        code_url = ftl.upload_file(code_file)    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    submission_id = ctl.create_submission(user_id, language, code_url, problem_id)

    # Add job to queue
    JudgeQueue.getInstance().add_submission(submission_id)

    return jsonify({'submission_id': submission_id}), 200

# Get a submission
@app.route('/api/submission/<int:submission_id>', methods=['GET'])
def get_submission(submission_id):
    try:
        jwt = request.headers['Authorization']
    except Exception:
        return 400
    
    # Decode jwt to get user_id
    user_id, code = decodeJWT(jwt)
    if code == 401:
        return jsonify({'error': 'JWT expired'}), 401
    
    submission = ctl.get_submission(submission_id)

    # Check if submission with id exist
    if submission == None:
        return jsonify({'error': 'submission not found'}), 404
    
    # Check if submission belong to requested user
    if submission['user_id'] != user_id:
        return jsonify({'error': 'You are not allow to view others\' submission'}), 403
    
    return jsonify({'submission': submission}), 200

# Access static uploaded file
@app.route('/api/uploads/<filename>', methods=['GET'])
def static_dir(filename):
    return send_from_directory('uploads', filename)

@app.route('/api/facebook/deletion', methods= ['POST'])
def data_deletion_callback():
    signed_request = request.form.get('signed_request')

    social_id = parse_fb_signed_request(signed_request)

    ctl.delete_user(social_id)
    
    return jsonify({
        'url': 'https://example.com/200',
        'confirmation_code': '200'
    })

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    app.run(debug=True)