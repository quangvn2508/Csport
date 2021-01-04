import React from 'react';
import { Container, Table, Badge, Row, Col, Card, ListGroup } from 'react-bootstrap';
// import axios from 'axios';

class Submission extends React.Component {
    state = {
        testcases: []
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
        const status = ['AC', 'RE', 'CE', 'WA', 'TLE'];
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({id: i, 
                status: status[Math.floor(Math.random() * 5)],
                time: Math.ceil(Math.random() * 1000)
            })
        }

        this.setState({testcases: data});
    }
    
    render() {
        return (<>
            <Container>
                <h1>Submission {this.submissionId}</h1>
                <Row className="mt-5">
                    <Col md='4'>
                        <Card bg="light" className="card">
                            <ListGroup>
                                <ListGroup.Item className="text-center">wang</ListGroup.Item>
                                <ListGroup.Item className="text-center">problem</ListGroup.Item>
                                <ListGroup.Item className="text-center">language</ListGroup.Item>
                                <ListGroup.Item className="text-center">passed</ListGroup.Item>
                                <ListGroup.Item className="text-center">total time</ListGroup.Item>
                                <ListGroup.Item className="text-center">ranking</ListGroup.Item>
                                <ListGroup.Item className="text-center">max problem point</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col md='8'>
                        <Card bg="light" className="card">
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
                                    return (<tr key={testcase.id}>
                                                <td>{testcase.id}</td>
                                                <td>
                                                    <Badge variant={this.badgeMapping[testcase.status]}>{testcase.status}</Badge>
                                                </td>
                                                <td>{testcase.time}</td>
                                            </tr>)
                                })}
                            </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
                
            </Container>
        </>);
    }
    
}

export default Submission;

