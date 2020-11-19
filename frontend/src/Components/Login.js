import axios from 'axios';
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_APP_ID, JWT_KEY } from './../config';
import { Container } from 'react-bootstrap';
import Cookie from 'js-cookie';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    state = {
      redirect: null
    }

    facebookResponse = (res) => {
      axios.post('/api/authorize/facebook/', {
        token: res.accessToken
      })
      .then(res => {
        Cookie.set(JWT_KEY, res.data.jwt);
        this.setState({redirect: '/'})
      })
      .catch(err => console.log(err));
    };

    onFailure = (error) => {
      alert(error);
    }

    render() {
      if (this.state.redirect !== null) {
        return <Redirect to={this.state.redirect}/>
      } else {
        return (
            <Container>
                <FacebookLogin appId={FACEBOOK_APP_ID} autoLoad={false} callback={this.facebookResponse} />
            </Container>
        );
      }
    }
}

export default Login;