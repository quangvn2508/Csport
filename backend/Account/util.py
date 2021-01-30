import jwt
from datetime import datetime, timedelta
from config import JWT_KEY, JWT_ALGORITHM, IDENTITY_PROVIDERS
import base64
import hashlib
import hmac
import simplejson as json

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


def base64_url_decode(inp):
    padding_factor = (4 - len(inp) % 4) % 4
    inp += "="*padding_factor 
    return base64.b64decode(unicode(inp).translate(dict(zip(map(ord, u'-_'), u'+/'))))

def parse_fb_signed_request(signed_request, secret):

    l = signed_request.split('.', 2)
    encoded_sig = l[0]
    payload = l[1]

    sig = base64_url_decode(encoded_sig)
    data = json.loads(base64_url_decode(payload))

    if data.get('algorithm').upper() != 'HMAC-SHA256':
        return None
    else:
        expected_sig = hmac.new(secret, msg=payload, digestmod=hashlib.sha256).digest()

    if sig != expected_sig:
        return None
    else:
        return data