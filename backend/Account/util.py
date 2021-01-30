import jwt
from datetime import datetime, timedelta
from config import JWT_KEY, JWT_ALGORITHM, IDENTITY_PROVIDERS
from facepy import SignedRequest

def encodeJWT(user_id):
    payload = {
        'user_id' : user_id,
        'exp': datetime.utcnow() + timedelta(seconds=2592000)
    }
    token = str(jwt.encode(payload, JWT_KEY, JWT_ALGORITHM))

    return token

def decodeJWT(_jwt):
    try:
        payload = jwt.decode(_jwt, JWT_KEY, algorithms = [JWT_ALGORITHM])        
    except jwt.ExpiredSignatureError:
        return None, 401
    
    return payload['user_id'], None


def parse_fb_signed_request(signed_request):
    signed_request = SignedRequest(signed_request, IDENTITY_PROVIDERS['facebook']['clientSecret'])
    
    return signed_request.user.id