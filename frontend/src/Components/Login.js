import axios from 'axios';
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_APP_ID } from './../config';
import { Modal } from 'react-bootstrap';
import './../Style/Login.css';
import { connect } from 'react-redux';
import { setJwt, showLoginPanel, addMessage, addError } from '../redux/actions';

function mapStateToProps(state) {
    return {
        jwt: state.jwt,
        show: state.showLoginPanel
    }
}

const mapDipatchToProps = {
    setJwt,
    showLoginPanel,
    addMessage,
    addError
}

class Login extends React.Component {
  handleHide = () => this.props.showLoginPanel(false);

  facebookResponse = (res) => {
    axios.post('/api/authorize/facebook/', {
      token: res.accessToken
    })
      .then(res => {
        this.props.setJwt(res.data.jwt);
        
        this.props.addMessage('Login successfully');
        this.handleHide();
      })
      .catch(err => {
        this.props.addError(err.response.data.error, err.response.status);
      });
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={(this.handleHide)}>
        <Modal.Header closeButton>
          <Modal.Title>Login with</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="login-button">
          <FacebookLogin 
            appId={FACEBOOK_APP_ID}
            autoLoad={false} 
            callback={this.facebookResponse} 
            textButton="facebook" size="small"/>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(Login);