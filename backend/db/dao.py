from Judge.SubmissionResult import SubmissionResult

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
            'user_id': 'facebook12415223',
            'language': 'cpp',
            'code_path': '/api/uploads/<name>',
            'verdict': None
        }
    ]
}

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
    id_count = 2

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
