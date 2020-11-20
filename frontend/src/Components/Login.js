import axios from 'axios';
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_APP_ID, JWT_KEY } from './../config';
import Cookie from 'js-cookie';
import { Modal } from 'react-bootstrap';
import './../Style/Login.css';

class Login extends React.Component {
  handleHide = () => this.props.setShow(false);

  facebookResponse = (res) => {
    axios.post('/api/authorize/facebook/', {
      token: res.accessToken
    })
      .then(res => {
        Cookie.set(JWT_KEY, res.data.jwt);
        // Notification here
        this.handleHide();
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Login with</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="login-button">
          <FacebookLogin appId={FACEBOOK_APP_ID} autoLoad={false} callback={this.facebookResponse} textButton="facebook" size="small"/>
          <FacebookLogin appId={FACEBOOK_APP_ID} autoLoad={false} callback={this.facebookResponse} textButton="facebook" size="small"/>
        </Modal.Body>
      </Modal>
    );
  }
}

export default Login;