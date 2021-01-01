import uuid
import os
import zipfile
from db.dao import UserTable, ProblemTable, SubmissionTable, database
from Judge.SubmissionResult import SubmissionResult

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

def append_submission(user_id, language, code_url, problem_id):
    path_to_code_file = UPLOAD_FOLDER + code_url.rsplit('/',1)[1]
    return SubmissionTable.getInstance().add(user_id, language, path_to_code_file, problem_id)

def update_verdict(submission_id, verdict):
    SubmissionTable.getInstance().update_verdict(submission_id, verdict)

def problem_testcase_directory(problem_id: int):
    return TESTCASE_FOLDER + 'problem_' + str(problem_id) + '/'

def extract_testcase(zip_url:str, problem_id: int):
    path_to_zip_file = UPLOAD_FOLDER + zip_url.rsplit('/',1)[1]
    directory_to_extract_to = problem_testcase_directory(problem_id)
    
    os.mkdir(directory_to_extract_to)

    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def get_submission(submission_id: int):
    return SubmissionTable.getInstance().get(submission_id)

def finish_judge_submission(submission_id: int, result: SubmissionResult):
    SubmissionTable.getInstance().update_verdict(submission_id, result.to_json())

def printdb():
    return database
