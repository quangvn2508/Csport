import React from 'react';
import { Container, Table, Badge, Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}


class Submission extends React.Component {
    state = {
        testcases: [],
        problem: '#',
        language: 'cpp',
        status: true,
        total_time: 1.05,
        ranking: 'N/A',
        pp: 'N/A',
        log: ''
    }

    submissionId = this.props.match.params.submissionId;
    badgeMapping = {
        'AC': 'success',
        'RE': 'warning',
        'CE': 'warning',
        'WA': 'danger',
        'TLE': 'secondary'
    };

    componentDidMount() {
        // const status = ['AC', 'RE', 'CE', 'WA', 'TLE'];
        // let data = [];
        // for (let i = 0; i < 10; i++) {
        //     data.push({test_no: i, 
        //         verdict: status[Math.floor(Math.random() * 5)],
        //         duration: Math.ceil(Math.random() * 1000)
        //     })
        // }

        // this.setState({testcases: data});
        
        axios.get('/api/submission/' + this.submissionId, {
            headers: {
                'Authorization': this.props.jwt
            }
        })
        .then(res => {
            if (res.status === 200) {
                const submission = res.data.submission;
                this.setState({
                    problem: submission.problem_id,
                    language: submission.language,
                    status: submission.verdict.status,
                    testcases: submission.verdict.testcases,
                    log: submission.verdict.log
                });
            }
        })
        .catch(err => {
            console.log(err.response);
        })
    }
    
    render() {
        return (<>
            <Container>
                <h1>Submission {this.submissionId}</h1>
                <Card bg="light" className="mb-3">
                    <ListGroup>
                        <ListGroup.Item action href='#' className="d-flex justify-content-between">
                            <div>Problem</div>
                            <span>{this.state.problem}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Language</div>
                            <span>{this.state.language}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Status</div>
                            <span><Badge variant={this.state.status? 'success' : 'danger'}>{this.state.status? 'passed' : 'fail'}</Badge></span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Time</div>
                            <span>{this.state.total_time} ms</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Rank</div>
                            <span>{this.state.ranking}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>PP</div>
                            <span>{this.state.pp}</span>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
                <Card bg="light" className="mb-3">
                    <Table hover>
                    <thead>
                        <tr>
                            <th>Test no.</th>
        
                            <th>Status</th>
        
                            <th>Elapsed time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.testcases.map((testcase) => {
                            return (<tr key={testcase.test_no}>
                                        <td>{testcase.test_no}</td>
                                        <td>
                                            <Badge variant={this.badgeMapping[testcase.verdict]}>{testcase.verdict}</Badge>
                                        </td>
                                        <td>{testcase.duration}</td>
                                    </tr>)
                        })}
                    </tbody>
                    </Table>
                </Card>

                <Card bg="light" className="mb-3">
                    <Card.Header>stderr</Card.Header>
                    <Card.Body>
                        <div>{this.state.log}</div>
                    </Card.Body>
                    
                </Card>
            </Container>
        </>);
    }
    
}

export default connect(mapStateToProps, null)(Submission);

