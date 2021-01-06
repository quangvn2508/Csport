from Judge.SubmissionResult import SubmissionResult
import sqlite3
from sqlite3 import Error
from db.queries import *

database = {
    'user': [
        {
            'id': 1,
            'username': 'quangvn',
            'social_id': 'facebook12415223'
        },
        {
            'id': 2,
            'username': 'teopro',
            'social_id': 'facebook12415125'
        },
    ],
    'problem': [
        {
            'id': 1,
            'title': 'problem 1',
            'statement': 'markdown statement',
            'difficulty': 5,
            'problemPoints': 5,
            'ranked': True
        }
    ],
    'submission': [
        {
            'id': 1,
            'user_id': '410945223266976',
            'problem_id': 1,
            'language': 'cpp',
            'code_path': '/api/uploads/<name>',
            'status': True,
            'log': 'any error?',
            'testcases': [
                {'test_no': 0, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 1, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 2, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 3, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 4, 'duration': 0.5, 'verdict': 'AC'}
            ]
        },
        {
            'id': 2,
            'user_id': '410945223266976',
            'problem_id': 1,
            'language': 'py',
            'code_path': '/api/uploads/<name>',
            'status': True,
            'log': 'any error?',
            'testcases': [
                {'test_no': 0, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 1, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 2, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 3, 'duration': 0.5, 'verdict': 'AC'},
                {'test_no': 4, 'duration': 0.5, 'verdict': 'AC'}
            ]
        }
    ]
}

class SqliteConnector(object):
    DB_FILE = 'database.db'
    def __init__(self):
        self.conn = create_connection(SqliteConnector.DB_FILE)
        self.db_query(USER_CREATE_TABLE)
        self.db_query(PROBLEM_CREATE_TABLE)
        self.db_query(SUBMISSION_CREATE_TABLE)
        self.db_query(TESTCASE_VERDICT_CREATE_TABLE)

    def create_connection(self, db):
        conn = None
        try:
            conn = sqlite3.connect(db)
        except Error as e:
            print(e)
        
        return conn

    def db_query(self, query, t = ()):
        result = None
        try:
            c = self.conn.cursor()
            result = c.execute(query, t)
            self.conn.commit()
        except Error as e:
            print(e)
        
        return result
    
    def close_connection(self):
        self.conn.close()

db = SqliteConnector()

class UserTable(object):
    instance = None
    id_count = 3

    # Get user from social id
    def get(self, _id):
        for user in database['user']:
            if user['social_id'] == _id:
                return user
        
        return None

    def add(self, _id):
        database['user'].append({
            'id': UserTable.id_count, 
            'username': _id, 
            'social_id': _id,
        })
        UserTable.id_count += 1
        return UserTable.id_count - 1

    def update(self):
        pass

    @classmethod
    def getInstance(cls):
        if not UserTable.instance:
            UserTable.instance = UserTable()
        return UserTable.instance

class ProblemTable(object):
    instance = None
    id_count = 2

    def getAll(self):
        return database['problem']
    
    def get(self, _id):

        for problem in database['problem']:
            if problem['id'] == _id:
                return problem
        
        return None

    def add(self, title, statement):
        database['problem'].append({
            'id': ProblemTable.id_count,
            'title': title,
            'statement': statement,
            'difficulty': 5,
            'problemPoints': 5,
            'ranked': True
        })
        ProblemTable.id_count += 1
        return ProblemTable.id_count - 1

    def update(self):
        pass

    @classmethod
    def getInstance(cls):
        if not ProblemTable.instance:
            ProblemTable.instance = ProblemTable()
        return ProblemTable.instance

class SubmissionTable(object):
    instance = None
    id_count = 3

    def get(self, _id):
        for submission in database['submission']:
            if submission['id'] == _id:
                return submission
        
        return None

    def add(self, user_id, language, code_path, problem_id):
        database['submission'].append({
            'id': SubmissionTable.id_count,
            'user_id': user_id,
            'problem_id': problem_id,
            'language': language,
            'code_path': code_path,
            'verdict': None
        })
        SubmissionTable.id_count += 1
        return SubmissionTable.id_count - 1

    def update_verdict(self, submission_id: int, verdict: SubmissionResult):
        for submission in database['submission']:
            if submission['id'] == submission_id:
                submission['verdict'] = verdict
                return True
        return False

    @classmethod
    def getInstance(cls):
        if not SubmissionTable.instance:
            SubmissionTable.instance = SubmissionTable()
        return SubmissionTable.instance
