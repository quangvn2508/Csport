import requests
from requests.models import PreparedRequest
from config import IDENTITY_PROVIDERS

class OAuthSignIn(object):
    providers = None

    def __init__(self, provider_name):
        self.provider_name = provider_name
        credentials = IDENTITY_PROVIDERS[provider_name]
        self.client_id = credentials['clientId']
        self.client_secret = credentials['clientSecret']

    def authorize(self):
        pass

    @classmethod
    def get_provider(cls, provider_name):
        if cls.providers is None:
            cls.providers = {}
            for provider_class in cls.__subclasses__():
                provider = provider_class()
                cls.providers[provider.provider_name] = provider
        return cls.providers[provider_name]


class FacebookSignIn(OAuthSignIn):
    def __init__(self):
        super(FacebookSignIn, self).__init__('facebook')
        self.url = 'https://graph.facebook.com'

    def get_access_token(self):
        req = PreparedRequest()
        link = self.url + '/oauth/access_token'
        params = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }
        req.prepare_url(link, params)
        
        try:
            access_token = requests.get(req.url).json()['access_token']
        except (ValueError, KeyError, TypeError) as error:
            return None

        return access_token


    def authorize(self, user_token):
        access_token = self.get_access_token()
        
        req = PreparedRequest()
        link = self.url + '/debug_token'
        params = {
            'input_token': user_token,
            'access_token': access_token
        }
        req.prepare_url(link, params)
        
        try:
            user_id = requests.get(req.url).json()['data']['user_id']
        except (ValueError, KeyError, TypeError) as error:
            return None
        
        return user_id
