import React from 'react';
import ReactApexChart from "react-apexcharts";
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import './../Style/Profile.css';

const series = [{
    name: "rank",
    data: [...Array(90).keys()].map(ele => ele + 100)
}];

const options = {
    chart: {
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1,
        colors: '#000000',
        curve: 'smooth'
    },
    xaxis: {
        categories: [...Array(90).keys()].reverse().map(ele => (ele + 1) + " days ago"),
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        tooltip: {
            enabled: false
        },
        reversed: true
    },
    yaxis: {
        labels: {
            show: false
        },
        reversed: true
    },
    grid: {
        show: false
    },
    markers: {
        size: 0,
        colors: '#aaaaaa',
        discrete: [],
        shape: "circle",
        radius: 0
    }
}

const fake_profile = {
    profile: {
        avatar: 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png',
        name: 'quangvn2508'
    },
    statistic: {
        cp: 100,
        rank: 10,
        solved: 123
    }
}

function Profile() {
    
    // https://apexcharts.com/docs/options/markers/
    return (
        <Container>
            <Row className="mt-5">
                <Col md='4'>
                    <Card bg="light" className="mb-3">
                        <Card.Header>Profile</Card.Header>
                        <Card.Body>
                            <div className="profile-card mt-3">
                                <div 
                                    className="profile-avatar"
                                    style={{backgroundImage: 'url(' + fake_profile.profile.avatar + ')'}}/>
                                <h4>{fake_profile.profile.name}</h4>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card bg="light" className="mb-3">
                        <Card.Header>Statistic</Card.Header>
                        <ListGroup>
                            {
                                Object.keys(fake_profile.statistic).map((key) => (
                                    <ListGroup.Item key={key} className="d-flex justify-content-between">
                                        <div>{key}</div>
                                        <span><Badge variant='secondary'>{fake_profile.statistic[key]}</Badge></span>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>
                <Col md='8'>
                    <Card bg="light" className="mb-3">
                        <Card.Header>Ranking history</Card.Header>
                        <ReactApexChart options={options} series={series} type="line" height={200} />
                    </Card>


                    {/* Solved problem list */}
                    <Card bg="light" className="mb-3">
                        <Card.Header>Top problem points problems</Card.Header>
                        <ListGroup>
                            {
                                Object.keys(fake_profile.statistic).map((key) => (
                                    <ListGroup.Item key={key} className="d-flex justify-content-between">
                                        <div>{key}</div>
                                        <span><Badge variant='secondary'>{fake_profile.statistic[key]}</Badge></span>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            
        </Container>
        );
};

export default Profile;