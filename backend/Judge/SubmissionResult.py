from enum import Enum

class Verdict(Enum):
    TIME_LIMIT_EXCEED = 'TLE'
    ACCEPT = 'AC'
    WRONG_ANSWER = 'WA'
    COMPILATION_ERROR = 'CE'
    RUNTIME_ERROR = 'RE'

class TestcaseResult(object):
    def __init__(self, test_no: int, duration: float, verdict: Verdict):
        self.test_no = test_no
        self.duration = duration
        self.verdict = verdict


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