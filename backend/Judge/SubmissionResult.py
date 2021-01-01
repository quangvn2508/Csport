from enum import Enum

class Verdict(Enum):
    TLE = 'Time Limit Exceed'
    AC = 'Accept'
    WA = 'Wrong Answer'
    CE = 'Compilation Error'
    RE = 'Runtime Error'

class TestcaseResult(object):
    def __init__(self, test_no: int, duration: float, verdict: Verdict):
        self.test_no = test_no
        self.duration = duration
        self.verdict = verdict
    
    def to_json(self):
        return {
            'test_no': self.test_no,
            'duration': self.duration,
            'verdict': self.verdict.value
        }

class SubmissionResult(object):
    def __init__(self):
        self.status = True
        self.testcase_verdict = []
        self.log = ""

    def add_testcase_verdict(self, test_no: int, status: bool, verdict: Verdict, duration: float):
        self.status = (self.status and status)

        self.testcase_verdict.append(TestcaseResult(test_no, duration, verdict))
    
    def add_log(self, log: str):
        self.log = log

    def to_json(self):
        return {
            'status': self.status,
            'log': self.log,
            'testcases': [v.to_json() for v in self.testcase_verdict]
        }