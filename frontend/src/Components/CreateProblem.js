import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Container, Form, Button } from 'react-bootstrap';
import Tooltip from './Tooltip';
import UploadPanel from './UploadPanel';

class CreateProblem extends React.Component {
    state = {
        title: '',
        statement: '',
        testFile: null,
        showFileUploadPanel: false
    }

    constructor(props) {
        super(props);
        this.editor = React.createRef();
    }

    openFileSubmit = () => {
        this.setState({showFileUploadPanel: true});
    }

    editorOptions = {
        toolbar: [
            "bold", "italic", "strikethrough", "|",
            "heading-1", "heading-2", "heading-3", "|",
            "code", "quote", "unordered-list", "ordered-list", "horizontal-rule", "table", "|",
            "link",
            {
                name: "custom-image",
                action: this.openFileSubmit,
                className: "fa fa-picture-o",
                title: "Insert image",
            },
            "|",
            "preview"
        ],
        placeholder: '# Your problem statement here'
    };
    
    validateForm = () => {return true};
    updateTitle = (event) => {this.setState({title: event.target.value});};
    updateStatement = (value) => {this.setState({statement: value})};
    updateTestCaseFile = (event) => {this.setState({testFile: event.target.files[0]});}

    submitNewProblem = (event) => {
        event.preventDefault();
        let data = {
            testcase: new FormData(),
            title: this.state.title,
            statement: this.state.statement
        };

        data.testcase.append('file', this.state.testFile);

        console.log(data);
    }
    render() {
        return (
            <>
            <UploadPanel
                show={this.state.showFileUploadPanel}
                onHide={() => this.setState({showFileUploadPanel: false})}
                accept="image/*"
                onSuccess={(url) => {
                    this.editor.current.simpleMde.value(this.state.statement + `\n![](${url})\n`);
                }}
            />
            <Container className="mb-5">
                <h1>Create Problem</h1>
                <form onSubmit={this.submitNewProblem}>
                    <Form.Group>
                        <Form.Control type="text" value={this.state.title} onChange={this.updateTitle} placeholder="Problem title" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="hidden" value={this.state.statement} placeholder="Problem title" />

                        <SimpleMDE ref={this.editor} onChange={this.updateStatement} options={this.editorOptions}/>

                    </Form.Group>
                    <hr
                        style={{
                            backgroundColor: '#aaaaaa',
                            height: 1
                        }}
                    />

                    <Form.Group>

                        <Form.Label>
                            Problem's testcase
                            <Tooltip title="How zip file should looks like?" content={
                                <>
                                    <p>Contain input and output files <strong>input_[id].txt</strong> and <strong>output_[id].txt</strong></p>
                                    <Button variant="secondary" href="/" target="_blank">Example testcase file</Button>
                                </>
                            }/>
                        </Form.Label>
                        <Form.Control type="file" accept=".zip" onChange={this.updateTestCaseFile}/>
                    </Form.Group>
                    
                    <Form.Control type="submit" className="btn-secondary" disabled={!this.validateForm()}/>
                </form>
            </Container>

            </>
        );
    }
}

export default CreateProblem;