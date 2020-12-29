from threading import Thread
import asyncio
import queue
import time

class JudgeQueue(queue.Queue):

    def __init__(self):
        queue.Queue.__init__(self)
        self.sem = asyncio.Semaphore(0)
        self.start_workers()

    def add_submission(self, submission_id):
        self.put(submission_id)
        self.sem.release()

    def start_workers(self):
        t = Thread(target=self.worker)
        t.daemon = True
        t.start()

    def worker(self):
        while True:
            submission_id = self.get()
            print("start judge submission " + str(submission_id))
            time.sleep(2)
            # TODO run
            print("finish judge for submission " + str(submission_id))
            self.task_done()
