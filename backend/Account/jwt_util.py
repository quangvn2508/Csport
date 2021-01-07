import jwt
from datetime import datetime, timedelta
from config import JWT_KEY, JWT_ALGORITHM

def encodeJWT(user_id):
    payload = {
        'user_id' : user_id,
        'exp': datetime.utcnow() + timedelta(seconds=3600)
    }
    token = str(jwt.encode(payload, JWT_KEY, JWT_ALGORITHM))

    return token

def decodeJWT(_jwt):
    payload = jwt.decode(_jwt, JWT_KEY, algorithms = [JWT_ALGORITHM])

    return payload['user_id']