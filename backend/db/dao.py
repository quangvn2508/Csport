from Judge.SubmissionResult import SubmissionResult
import sqlite3
from sqlite3 import Error
from db.queries import *
from db.entities import UserEntity, ProblemEntity, SubmissionEntity, TestcaseEntity
import abc
from typing import List

class SqliteConnector(object):
    DB_FILE = 'database.db'
    instance = None
    def __init__(self):
        self.db_query(USER_CREATE_TABLE)
        self.db_query(PROBLEM_CREATE_TABLE)
        self.db_query(SUBMISSION_CREATE_TABLE)
        self.db_query(TESTCASE_VERDICT_CREATE_TABLE)

    def db_query(self, query, t = ()) -> sqlite3.Cursor:
        result = None
        with sqlite3.connect(SqliteConnector.DB_FILE) as conn:
            c = conn.cursor()
            result = c.execute(query, t)
            conn.commit()

        return result

    @classmethod
    def getInstance(cls):
        if not cls.instance:
            cls.instance = cls()
        return cls.instance

class Dao(metaclass=abc.ABCMeta):
    instance = None

    @classmethod
    def getInstance(cls):
        if not cls.instance:
            cls.instance = cls()
        return cls.instance


class UserDao(Dao):
    def get(self, _id: int) -> UserEntity:
        query = 'SELECT * FROM user WHERE UserId=?'
        user_tuple = SqliteConnector.getInstance().db_query(query, (_id, )).fetchone()
        if user_tuple is None:
            return None

        return UserEntity(*user_tuple)

    def get_with_social_id(self, social_id: str) -> UserEntity:
        query = 'SELECT * FROM user WHERE social_id=?'
        user_tuple = SqliteConnector.getInstance().db_query(query, (social_id, )).fetchone()
        if user_tuple is None:
            return None

        return UserEntity(*user_tuple)

    def add(self, social_id: str) -> int:
        query = 'INSERT INTO user (username, social_id) VALUES (?,?)'
        return SqliteConnector.getInstance().db_query(query, (social_id, social_id)).lastrowid

    @classmethod
    def getInstance(cls):
        return super().getInstance()

class ProblemDao(Dao):
    def get(self, _id: int) -> ProblemEntity:
        query = 'SELECT * FROM problem WHERE ProblemId=?'
        problem_tuple = SqliteConnector.getInstance().db_query(query, (_id, )).fetchone()
        if problem_tuple is None:
            return None

        return ProblemEntity(*problem_tuple)

    def getAll(self) -> List[ProblemEntity]:
        query = 'SELECT ProblemId, title, difficulty, problem_point, ranked FROM problem'
        problems = []
        for row in SqliteConnector.getInstance().db_query(query).fetchall():
            pi, tt, df, pp, rk = row
            problems.append(ProblemEntity(pi, None, tt, None, df, pp, rk))

        return problems
    
    def add(self, user_id: int, title: str, statement: str) -> int:
        query = 'INSERT INTO problem (UserId, title, statement) VALUES (?,?,?)'
        return SqliteConnector.getInstance().db_query(query, (user_id, title, statement)).lastrowid

    @classmethod
    def getInstance(cls):
        return super().getInstance()

class TestcaseDao(Dao):
    def getAll(self, submission_id: int) -> List[TestcaseEntity]:
        query = 'SELECT * FROM testcase_verdict WHERE SubmissionId=?'
        testcases = []
        for row in SqliteConnector.getInstance().db_query(query, (submission_id, )):
            testcases.append(TestcaseEntity(*row))
        
        return testcases
    
    def add(self, submission_id: int, test_no: int, duration: float, verdict: str):
        query = 'INSERT INTO testcase_verdict (SubmissionId, test_no, duration, verdict) VALUES (?,?,?,?)'
        return SqliteConnector.getInstance().db_query(query, (submission_id, test_no, duration, verdict)).lastrowid

    @classmethod
    def getInstance(cls):
        return super().getInstance()


class SubmissionDao(Dao):
    def get(self, _id: int) -> SubmissionEntity:
        query = 'SELECT * FROM submission WHERE SubmissionId=?'
        submission_tuple = SqliteConnector.getInstance().db_query(query, (_id, )).fetchone()
        if submission_tuple is None:
            return None
        
        return SubmissionEntity(*submission_tuple)

    def add(self, user_id, language, code_path, problem_id) -> int:
        query = 'INSERT INTO submission (UserId, ProblemId, language, code_path) VALUES (?,?,?,?)'
        return SqliteConnector.getInstance().db_query(query, (user_id, problem_id, language, code_path)).lastrowid

    def update(self, _id: int, status: bool, log: str):
        query = 'UPDATE submission SET judged=1, status=?, log=? WHERE SubmissionId=?'
        SqliteConnector.getInstance().db_query(query, (status, log, _id))

    @classmethod
    def getInstance(cls):
        return super().getInstance()