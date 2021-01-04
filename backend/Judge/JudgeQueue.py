from threading import Thread
import queue
import time
import db.controller as ctl
from Judge.sandbox import judge

class JudgeQueue(queue.Queue):
    instance = None

    def __init__(self):
        queue.Queue.__init__(self)
        self.start_workers()

    def add_submission(self, submission_id):
        self.put(submission_id)

    def start_workers(self):
        t = Thread(target=self.worker)
        t.daemon = True
        t.start()

    def worker(self):
        while True:
            submission_id = self.get()
            
            JudgeSubmission(submission_id)

            self.task_done()

    @classmethod
    def getInstance(cls):
        if not JudgeQueue.instance:
            JudgeQueue.instance = JudgeQueue()
        return JudgeQueue.instance

def JudgeSubmission(submission_id: int):
    submission = ctl.get_submission(submission_id)
    if submission == None:
        return

    code_path, problem_id, code_language = submission['code_path'], submission['problem_id'], submission['language']

    result = judge(code_path, ctl.problem_testcase_directory(problem_id), code_language)

    ctl.finish_judge_submission(submission_id, result)