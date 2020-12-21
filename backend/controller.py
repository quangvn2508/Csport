user_id_count = 3
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
    ]
}

class UserTable(object):
    instance = None

    # Get user from social id
    def get(self, _id):
        for user in database['user']:
            if user['social_id'] == _id:
                return user
        
        return None

    def add(self, _id):
        database['user'].append({'id': user_id_count, 'username': _id, 'social_id': _id})

    def update(self):
        pass

    def getInstance():
        if not UserTable.instance:
            UserTable.instance = UserTable()
        return UserTable.instance

# class ProblemTable(object):
#     instance = None
    
#     def get(self):
#         pass

#     def add(self):
#         pass

#     def update(self):
#         pass

#     def getInstance():
#         if not instance:
#             instance = ProblemTable()
#         return instance

def registered_social_id(social_id):
    return UserTable.getInstance().get(social_id) != None

def create_new_account(social_id):
    UserTable.getInstance().add(social_id)

def get_user_account(social_id):
    return UserTable.getInstance().get(social_id)