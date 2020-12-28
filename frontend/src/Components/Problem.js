import React from 'react';
import marked from 'marked';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Selection from './Selection';
import axios from 'axios';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

class Problem extends React.Component {
    state = {
        title: "Title",
        statement: "",
        problemId: this.props.match.params.problemId,
        language: "py",
        code: null
    }
    

    componentDidMount() {
        axios.get('/api/problem/' + this.state.problemId)
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                let problem = res.data.problem;
                this.setState({
                    statement: marked(problem.statement),
                    title: problem.title
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    changeLanguage = (value) => {this.setState({language: value});}
    updateFile = (event) => {this.setState({code: event.target.files[0]});}
    submitCode = (event) => {
        event.preventDefault();
        console.log(this.state.language);
        console.log(this.state.code);
        // TODO: Submit code to evaluate
        let data = new FormData();

        data.append('file', this.state.code);

        let header = {
            'Authorization': this.props.jwt,
            'language': this.state.language 
        }

        console.log(header);

        axios.post('/api/submit/' + this.state.problemId, data, {
            headers: header
        })
        .then(res => {
            if (res.status === 200) {
                console.log(res);
            }
        })
        .catch(err => {
            console.log(err.response.data.error);
        });
    }

    render() {
        return (
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
export default connect(mapStateToProps, null)(Problem);