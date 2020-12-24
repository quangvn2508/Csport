import uuid
import os

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
            'test_directory': './'
        }
    ]
}

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

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
        database['user'].append({'id': UserTable.id_count, 'username': _id, 'social_id': _id})
        UserTable.id_count += 1
        return UserTable.id_count - 1

    def update(self):
        pass

    def getInstance():
        if not UserTable.instance:
            UserTable.instance = UserTable()
        return UserTable.instance

class ProblemTable(object):
    instance = None
    id_count = 2
    
    def get(self, _id):

        for problem in database['problem']:
            if problem['id'] == _id:
                return problem
        
        return None

    def add(self, title, statement, testcase_url):
        database['problem'].append({'id': ProblemTable.id_count, 'title': title, 'statement': statement, 'test_directory': testcase_url})
        ProblemTable.id_count += 1
        return ProblemTable.id_count - 1

    def update(self):
        pass

    def getInstance():
        if not ProblemTable.instance:
            ProblemTable.instance = ProblemTable()
        return ProblemTable.instance

def registered_social_id(social_id):
    return UserTable.getInstance().get(social_id) != None

def create_new_account(social_id):
    UserTable.getInstance().add(social_id)

def get_user_account(social_id):
    return UserTable.getInstance().get(social_id)

def file_extension_from_name(filename):
    # Check if file name contain '.' character
    if not '.' in filename:
        return None

    return filename.rsplit('.', 1)[1].lower()

def upload_file(file):
    # Get file extension
    fileExtension = file_extension_from_name(file.filename)

    # Check allowed extension

    # Create new unique name for file
    filename = str(uuid.uuid4()) + '.' + fileExtension

    file.save(UPLOAD_FOLDER + filename)

    # Return static url
    return '/api/uploads/' + filename

def create_new_problem(title, statement, testcase_url):
    problem_id = ProblemTable.getInstance().add(title, statement, testcase_url)
    return problem_id

def get_problem(problem_id):
    return ProblemTable.getInstance().get(problem_id)