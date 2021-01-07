class UserEntity(object):
    def __init__(self, UserId: int, username: str, social_id: str):
        self.UserId = UserId
        self.username = username
        self.social_id = social_id

    def to_json(self):
        return {
            'id': self.UserId,
            'username': self.username,
            'social_id': self.social_id
        }

class ProblemEntity(object):
    def __init__(self, ProblemId: int, UserId: int, title: str, statement: str, difficulty:int, problem_point:int, ranked:bool):
        self.ProblemId = ProblemId
        self.UserId = UserId
        self.title = title
        self.statement = statement
        self.difficulty = difficulty
        self.problem_point = problem_point
        self.ranked = ranked
    
    def to_json(self):
        return {
            'id': self.ProblemId,
            'user_id': self.UserId,
            'title': self.title,
            'statement': self.statement,
            'difficulty': self.difficulty,
            'problem_point': self.problem_point,
            'ranked': self.ranked
        }

class SubmissionEntity(object):
    def __init__(self, SubmissionId: int, UserId: int, ProblemId: int, language: str, code_path: str, judged: bool, status: bool, log: str):
        self.SubmissionId = SubmissionId
        self.UserId = UserId
        self.ProblemId = ProblemId
        self.language = language
        self.code_path = code_path
        self.judged = judged
        self.status = status
        self.log = log
    
    def to_json(self):
        return {
            'id': self.SubmissionId,
            'user_id': self.UserId,
            'problem_id': self.ProblemId,
            'language': self.language,
            'code_path': self.code_path,
            'judged': self.judged,
            'status': self.status,
            'log': self.log
        }

class TestcaseEntity(object):
    def __init__(self, TestcaseId: int, SubmissionId: int, test_no: int, duration: float, verdict: str):
        self.TestcaseId = TestcaseId
        self.SubmissionId = SubmissionId
        self.test_no = test_no
        self.duration = duration
        self.verdict = verdict
    
    def to_json(self):
        return {
            'id': self.TestcaseId,
            'submission_id': self.SubmissionId,
            'test_no': self.test_no,
            'duration': self.duration,
            'verdict': self.verdict
        }