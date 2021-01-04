import axios from 'axios';
import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';


function UploadPanel(props) {
  const [file, setFile] = useState(null);
  const updateFile = (event) => {setFile(event.target.files[0])}

  const submitFile = (event) => {
    event.preventDefault();
    
    let data = new FormData();

    data.append('file', file);

    axios.post('/api/file_upload', data)
    .then(res => {
      console.log(res.data);
      if (res.status === 200) {
        props.onSuccess(res.data.url);
      }
    })
    .catch(err => {
      console.log(err.response.data.error);
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

export default UploadPanel;