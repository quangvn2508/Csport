import React from 'react';
import marked from 'marked';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Selection from './Selection';
import axios from 'axios';
import { connect } from 'react-redux';
import { addError, addMessage } from '../redux/actions';
import { Redirect } from 'react-router-dom';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

const mapDipatchToProps = {
    addError,
    addMessage
}

class Problem extends React.Component {
    state = {
        title: "Title",
        statement: "",
        problemId: this.props.match.params.problemId,
        language: "py",
        code: null,
        redirect: null
    }
    

    componentDidMount() {
        axios.get('/api/problem/' + this.state.problemId)
        .then(res => {
            const problem = res.data.problem;
            this.setState({
                statement: marked(problem.statement),
                title: problem.title
            });
        })
        .catch(err => {
            this.props.addError('Unable to get problem');
            this.setState({redirect: '/'});
        });
    }

    changeLanguage = (value) => {this.setState({language: value});}
    updateFile = (event) => {this.setState({code: event.target.files[0]});}
    submitCode = (event) => {
        event.preventDefault();
        let data = new FormData();

        data.append('file', this.state.code);

        let header = {
            'Authorization': this.props.jwt,
            'language': this.state.language
        };

        axios.post('/api/submit/' + this.state.problemId, data, {
            headers: header
        })
        .then(res => {
            this.props.addMessage('Submission recorded');
            this.setState({redirect: '/submission/' + res.data.submission_id});
        })
        .catch(err => {
            if (err.response.status === 401) {
                // invalid JWT
                this.props.addError(err.response.body.error, 'Login session expired');
                this.props.removeJwt();
            } else this.props.addError(err.response.body.error);
        });

    }

    render() {
        return (
            this.state.redirect !== null?
            <Redirect to={this.state.redirect}/> :
            <Container>
                <h1>{this.state.title}</h1>
                <article dangerouslySetInnerHTML={{__html: this.state.statement}}></article>
                <Form onSubmit={this.submitCode}>
                    <Row>
                        <Col xs={2}>
                            <Selection title="Language" update={this.changeLanguage} selection={[{value: "py", label: "Python3"}, {value: "cpp", label: "C++14"}]} />
                        </Col>
                        
                        <Col xs={4}>
                            <input type="file" accept=".cpp,.py" onChange={this.updateFile}/>
                        </Col>
                        
                        <Col xs={2}>
                            <Button type="submit" variant="secondary" size="sm">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDipatchToProps)(Problem);