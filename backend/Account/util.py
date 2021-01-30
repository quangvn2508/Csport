import jwt
from datetime import datetime, timedelta
from config import JWT_KEY, JWT_ALGORITHM, IDENTITY_PROVIDERS
import base64
import hashlib
import hmac
import json

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
    encoded_sig, payload = signed_request.split('.', 2)
    secret = IDENTITY_PROVIDERS['facebook']['clientSecret']

    encoded_sig = encoded_sig.encode('ascii')
    payload = payload.encode('ascii')
    encoded_sig += "=" * ((4 - len(encoded_sig) % 4) % 4)
    payload += "=" * ((4 - len(payload) % 4) % 4)

    sig = base64.urlsafe_b64decode(encoded_sig)
    data = json.loads(base64.urlsafe_b64decode(payload))

    # check the signature
    expected_sig = hmac.new(secret, payload, hashlib.sha256).digest()
    if not hmac.compare_digest(expected_sig,sig):
        return None
    else:
        return data