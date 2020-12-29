import uuid
import os
import zipfile
from dao import UserTable, ProblemTable, SubmissionTable, database

UPLOAD_FOLDER = 'uploads/'
TESTCASE_FOLDER = 'testcases/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# Controllers
def registered_social_id(social_id):
    return UserTable.getInstance().get(social_id) != None

def create_new_account(social_id):
    UserTable.getInstance().add(social_id)

def get_user_account(social_id):
    return UserTable.getInstance().get(social_id)

def file_extension_from_name(filename):
    # Check if file name contain '.' character
    if not '.' in filename:
        return None

    return filename.rsplit('.', 1)[1].lower()

def upload_file(file):
    # Get file extension
    fileExtension = file_extension_from_name(file.filename)

    # TODO Check allowed extension

    # Create new unique name for file
    filename = str(uuid.uuid4()) + '.' + fileExtension

    file.save(UPLOAD_FOLDER + filename)

    # Return static url
    return '/api/uploads/' + filename

def create_new_problem(title, statement):
    problem_id = ProblemTable.getInstance().add(title, statement)
    return problem_id

def get_problem(problem_id):
    return ProblemTable.getInstance().get(problem_id)

def get_list_problems():
    return ProblemTable.getInstance().getAll()

def append_submission(user_id, language, code_path):
    return SubmissionTable.getInstance().add(user_id, language, code_path)

def update_verdict(submission_id, verdict):
    SubmissionTable.getInstance().update_verdict(submission_id, verdict)

def extract_testcase(zip_url:str, problem_id: int):
    path_to_zip_file = UPLOAD_FOLDER + zip_url.rsplit('/',1)[1]
    directory_to_extract_to = TESTCASE_FOLDER + 'problem_' + str(problem_id)
    
    os.mkdir(directory_to_extract_to)

    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def printdb():
    return database
