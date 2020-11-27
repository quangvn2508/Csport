// import axios from 'axios';
import React from 'react';
import { Form, Modal } from 'react-bootstrap';



function UploadPanel(props) {
  const submitFile = (event) => {
    event.preventDefault();
    console.log("Submit file");
    props.onSuccess('this_is_link');
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
            <Form.Control type="file" accept={props.accept}/>
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