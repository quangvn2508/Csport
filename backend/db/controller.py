from db.dao import UserDao, ProblemDao, SubmissionDao, TestcaseDao
from db.entities import *
from Judge.SubmissionResult import SubmissionResult
from typing import List
import db.file_util as ftl

UPLOAD_FOLDER = 'uploads/'

# user
def get_user(user_id: int) -> dict:
    user = UserDao.getInstance().get(user_id)
    if user is None:
        return None
    
    return user.to_json()

def get_user_id(social_id: str) -> int:
    user = UserDao.getInstance().get_with_social_id(social_id)
    if user is None:
        return None
    
    return user.UserId

def create_user(social_id: str) -> int:
    return UserDao.getInstance().add(social_id)

def registered_social_id(social_id: str) -> bool:
    return UserDao.getInstance().get_with_social_id(social_id) != None

def delete_user(social_id: str):
    UserDao.getInstance().remove(social_id)

# problem
def create_problem(user_id: int, title: str, statement: str) -> int:
    return ProblemDao.getInstance().add(user_id, title, statement)

def get_problem(problem_id: int):
    problem = ProblemDao.getInstance().get(problem_id)
    if problem is None:
        return None
    
    return problem.to_json()

def get_problems_all() -> List:
    return [problem.to_json() for problem in ProblemDao.getInstance().getAll()]

# submission

def create_submission(user_id: int, language: str, code_url: str, problem_id: int) -> int:
    path_to_code_file = ftl.file_url_to_file_path(code_url)
    return SubmissionDao.getInstance().add(user_id, language, path_to_code_file, problem_id)

def get_submission(submission_id: int):
    submission = SubmissionDao.getInstance().get(submission_id)
    submission_json = submission.to_json()
    submission_json['testcases'] = []
    if submission.judged:
        submission_json['testcases'] = [obj.to_json() for obj in TestcaseDao.getInstance().getAll(submission_id)]

    return submission_json

def update_submission(submission_id: int, status: bool, log: str):
    SubmissionDao.getInstance().update(submission_id, status, log)

# judge
def finish_judge_submission(submission_id: int, result: SubmissionResult):
    for testcase in result.testcase_verdict:
        TestcaseDao.getInstance().add(submission_id, testcase.test_no, testcase.duration, testcase.verdict.value)
    
    SubmissionDao.getInstance().update(submission_id, result.status, result.log)