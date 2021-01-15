import uuid
import os
import zipfile
from db.dao import UserDao, ProblemDao, SubmissionDao, TestcaseDao
from db.entities import *
from Judge.SubmissionResult import SubmissionResult
from typing import List

UPLOAD_FOLDER = 'uploads/'
TESTCASE_FOLDER = 'testcases/'
ALLOWED_EXTENSIONS = {'txt', 'png', 'jpg', 'jpeg', 'gif', 'cpp', 'py'}

def get_user_account(user_id: int) -> dict:
    user = UserDao.getInstance().get(user_id)
    if user is None:
        return None
    
    return user.to_json()

def get_user_id(social_id: str) -> int:
    user = UserDao.getInstance().get_with_social_id(social_id)
    if user is None:
        return None
    
    return user.UserId

def registered_social_id(social_id: str) -> bool:
    return UserDao.getInstance().get_with_social_id(social_id) != None

def create_new_account(social_id: str):
    new_id = UserDao.getInstance().add(social_id)

def file_extension_from_name(filename: str) -> str:
    # Check if file name contain '.' character
    if not '.' in filename:
        return None

    return filename.rsplit('.', 1)[1].lower()

def upload_file(file) -> str:
    # Get file extension
    fileExtension = file_extension_from_name(file.filename)

    if not fileExtension in ALLOWED_EXTENSIONS:
        raise Exception('File type not allowed')

    # TODO Check allowed extension

    # Create new unique name for file
    filename = str(uuid.uuid4()) + '.' + fileExtension

    file.save(UPLOAD_FOLDER + filename)

    # Return static url
    return '/api/uploads/' + filename

def create_new_problem(user_id: int, title: str, statement: str) -> int:
    return ProblemDao.getInstance().add(user_id, title, statement)

def get_problem(problem_id: int):
    problem = ProblemDao.getInstance().get(problem_id)
    if problem is None:
        return None
    
    return problem.to_json()

def get_list_problems() -> List:
    return [problem.to_json() for problem in ProblemDao.getInstance().getAll()]

def add_submission(user_id: int, language: str, code_url: str, problem_id: int) -> int:
    path_to_code_file = UPLOAD_FOLDER + code_url.rsplit('/',1)[1]
    return SubmissionDao.getInstance().add(user_id, language, path_to_code_file, problem_id)

def update_verdict(submission_id: int, status: bool, log: str):
    SubmissionDao.getInstance().update(submission_id, status, log)

def problem_testcase_directory(problem_id: int) -> str:
    return TESTCASE_FOLDER + 'problem_' + str(problem_id) + '/'

def extract_testcase(zip_url: str, problem_id: int):
    path_to_zip_file = UPLOAD_FOLDER + zip_url.rsplit('/',1)[1]
    directory_to_extract_to = problem_testcase_directory(problem_id)
    
    os.mkdir(directory_to_extract_to)

    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def get_submission(submission_id: int):
    submission = SubmissionDao.getInstance().get(submission_id)
    submission_json = submission.to_json()
    submission_json['testcases'] = []
    if submission.judged:
        submission_json['testcases'] = [obj.to_json() for obj in TestcaseDao.getInstance().getAll(submission_id)]

    return submission_json

def finish_judge_submission(submission_id: int, result: SubmissionResult):
    for testcase in result.testcase_verdict:
        TestcaseDao.getInstance().add(submission_id, testcase.test_no, testcase.duration, testcase.verdict.value)
    
    SubmissionDao.getInstance().update(submission_id, result.status, result.log)