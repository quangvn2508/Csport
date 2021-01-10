import React from 'react';
import { Container, Table, Badge, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { addError } from '../redux/actions';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

const mapDipatchToProps = {
    addError
}


class Submission extends React.Component {
    state = {
        testcases: [],
        problem: '#',
        language: '',
        status: true,
        judged: false,
        total_time: 0,
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
        axios.get('/api/submission/' + this.submissionId, {
            headers: {
                'Authorization': this.props.jwt
            }
        })
        .then(res => {
            const submission = res.data.submission;
            this.setState({
                problem: submission.problem_id,
                language: submission.language,
                status: !!submission.status,
                judged: !!submission.judged,
                testcases: submission.testcases,
                total_time: submission.testcases.reduce((sum, cur) => sum + cur.duration, 0)
            });
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
        return (<>
            <Container>
                <h1>Submission {this.submissionId}</h1>
                <Card bg="light" className="mb-3">
                    <ListGroup>
                        <ListGroup.Item action href={'/problem/' + this.state.problem} className="d-flex justify-content-between">
                            <div>Problem</div>
                            <span>{this.state.problem}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Language</div>
                            <span>{this.state.language}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            <div>Status</div>
                            <span>
                                {
                                    (!this.state.judged && 
                                        <Badge variant="warning">Pending</Badge>
                                    ) ||
                                    <Badge variant={this.state.status? 'success' : 'danger'}>{this.state.status? 'Pass' : 'Fail'}</Badge>
                                }
                            </span>
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
                {
                    (this.state.judged) &&

                    (<Card bg="light" className="mb-3">
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
                    </Card>)
                }
                        
                {
                    this.state.log.length > 0 &&

                    <Card bg="light" className="mb-3">
                        <Card.Header>stderr</Card.Header>
                        <Card.Body>
                            <div>{this.state.log}</div>
                        </Card.Body>
                    </Card>
                }
            </Container>
        </>);
    }
    
}

export default connect(mapStateToProps, mapDipatchToProps)(Submission);

