import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Tooltip from './Tooltip';
import UploadPanel from './UploadPanel';
import axios from 'axios';
import { DownloadFromUrl } from './Util';
import { connect } from 'react-redux';
import { addMessage, addError, removeJwt } from '../redux/actions';
import { Redirect } from 'react-router-dom';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

const mapDipatchToProps = {
    addMessage,
    addError,
    removeJwt
}

class CreateProblem extends React.Component {
    state = {
        title: '',
        statement: '',
        showImageUpload: false,
        showZipUpload: false,
        testcaseUrl: null,
        redirect: null
    }

    constructor(props) {
        super(props);
        this.editor = React.createRef();
    }

    openImageSubmit = () => {
        this.setState({ showImageUpload: true });
    }

    openTestCaseSubmit = () => {
        this.setState({ showZipUpload: true });
    }

    editorOptions = {
        toolbar: [
            "bold", "italic", "strikethrough", "|",
            "heading-1", "heading-2", "heading-3", "|",
            "code", "quote", "unordered-list", "ordered-list", "horizontal-rule", "table", "|",
            "link",
            {
                name: "custom-image",
                action: this.openImageSubmit,
                className: "fa fa-picture-o",
                title: "Insert image",
            },
            "|",
            "preview"
        ],
        placeholder: '# Your problem statement here'
    };

    validateForm = () => {
        return  this.state.title.length >= 6 && this.state.title.length <= 50 &&
                this.state.statement.length >= 6 && this.state.statement.length <= 2000 &&
                this.state.testcaseUrl !== null;
    };
    updateTitle = (event) => { this.setState({ title: event.target.value }); };
    updateStatement = (value) => { this.setState({ statement: value }) };

    submitNewProblem = (event) => {
        event.preventDefault();

        let data = {
            title: this.state.title,
            statement: this.state.statement,
            testcase: this.state.testcaseUrl
        };
        
        axios.post('/api/problem', data, {
            headers: {
                'Authorization': this.props.jwt
            }
        })
        .then(res => {
            this.props.addMessage('Create problem successfully');
            const problem_id = res.data.problem_id;

            this.setState({redirect: '/problem/' + problem_id});
        })
        .catch(err => {
            if (err.response.status === 401) {
                // invalid JWT
                this.props.addError(err.response.data.error, 'Login session expired');
                this.props.removeJwt();
            } else this.props.addError(err.response.data.error);
        });
    }

    downloadTestcase = () => {
        DownloadFromUrl(this.state.testcaseUrl);
    }

    render() {
        return (
            this.state.redirect !== null?
            <Redirect to={this.state.redirect}/> : 
            <>
                <UploadPanel
                    show={this.state.showImageUpload}
                    onHide={() => this.setState({ showImageUpload: false })}
                    accept="image/*"
                    onSuccess={(url) => {
                        this.editor.current.simpleMde.value(this.state.statement + `\n![](${url})\n`);
                    }}
                />
                <UploadPanel
                    show={this.state.showZipUpload}
                    onHide={() => this.setState({ showZipUpload: false })}
                    accept=".zip"
                    onSuccess={(url) => {
                        this.setState({ testcaseUrl: url });
                    }}
                />
                <Container className="mb-5">
                    <h1>Create Problem</h1>
                    <form onSubmit={this.submitNewProblem}>
                        <Form.Group>
                            <Form.Control type="text" value={this.state.title} onChange={this.updateTitle} placeholder="Problem title" />
                            <Form.Text muted>Title must be 6-50 characters long</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="hidden" value={this.state.statement} placeholder="Problem title" />

                            <SimpleMDE ref={this.editor} onChange={this.updateStatement} options={this.editorOptions} />
                            <Form.Text muted>Statement must be 6-2000 characters long</Form.Text>
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
                                } />
                            </Form.Label>
                            <Row>
                                <Col sm="4">
                                    <Button className="btn btn-secondary" onClick={this.openTestCaseSubmit}>Upload test case</Button>
                                </Col>

                                <Col sm="4">
                                    {
                                        this.state.testcaseUrl === null ?
                                            <div className="btn">No testcase uploaded</div> :
                                            <Button className="btn btn-secondary" onClick={this.downloadTestcase}>Download testcase</Button>
                                    }

                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Control type="submit" className="btn-secondary" disabled={!this.validateForm()} />
                    </form>
                </Container>

            </>
        );
    }
}

export default connect(mapStateToProps, mapDipatchToProps)(CreateProblem);
