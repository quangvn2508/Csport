import axios from 'axios';
import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addMessage, addError } from '../redux/actions';

const mapDipatchToProps = {
    addMessage,
    addError
}

function UploadPanel(props) {
  const [file, setFile] = useState(null);
  const updateFile = (event) => {setFile(event.target.files[0])}

  const submitFile = (event) => {
    event.preventDefault();
    
    let data = new FormData();

    data.append('file', file);

    axios.post('/api/file_upload', data)
    .then(res => {
      props.addMessage('Upload successfully');
      props.onSuccess(res.data.url);
    })
    .catch(err => {
      addError(err.response.data.error, err.response.status);
    });

    setFile(null);
    props.onHide();
  }

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitFile}>
          <Form.Group>
            <Form.Control type="file" accept={props.accept} onChange={updateFile}/>
          </Form.Group>
          <Form.Group>
            <Form.Control type="submit" value="Submit"/>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default connect(null, mapDipatchToProps)(UploadPanel);