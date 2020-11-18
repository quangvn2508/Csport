import React from 'react';
import { Container, Table, ProgressBar, Badge, Row, Col,  Pagination } from 'react-bootstrap';
import { Slider } from "@material-ui/core";
import Selection from './Selection';

function PageController(props) {
    return (
        <Pagination>
            {props.current > 1 && 
                <>
                <Pagination.First onClick={() => props.update(1)}/>
                <Pagination.Prev onClick={() => props.update(props.current - 1)}/>
                </>
            }
            {
                [...Array(props.size).keys()].map(value => {
                    let pageNumber = value - Math.floor(props.size / 2) + props.current;
                    if (pageNumber >= 1 && pageNumber <= props.max) {
                        return <Pagination.Item active={pageNumber === props.current} onClick={() => props.update(pageNumber)} key={pageNumber}>{pageNumber}</Pagination.Item>
                    } else return undefined;
                })
            }
            {props.current < props.max && 
                <>
                <Pagination.Next onClick={() => props.update(props.current + 1)}/>
                <Pagination.Last onClick={() => props.update(props.max)}/>
                </>
            }
        </Pagination>
    );
}



class Problems extends React.Component {
    state = {
        problemSet: [],
        filteredProblemSet: [],
        accending: true, // Sort
        sortByKey: 'id', // Sort
        filterDifficulty: [0, 100], // Filter
        filterRank: null, // Filter
        filterStatus: null, // Filter
        numberOfPage: 1, // Pagination
        currentPage: 1, // Pagination
        problemPerPage: 10 // Pagination
    }
    
    // Functions for filter
    updateDifficultyRange = (event, value) => {
        this.setState({filterDifficulty: value}, this.applyFilter);
    };

    updateRankFilter = (value) => {
        this.setState({filterRank: value}, this.applyFilter);
    }

    updateStatusFilter = (value) => {
        this.setState({filterStatus: value}, this.applyFilter);
    }

    filterProblem(item) {
        return item.difficulty >= this.state.filterDifficulty[0] && 
            item.difficulty <= this.state.filterDifficulty[1] &&
            (this.state.filterRank === null || item.ranked === this.state.filterRank) && 
            (this.state.filterStatus === null || item.solved === this.state.filterStatus);
    }

    applyFilter() {
        const filteredProblems = this.state.problemSet.filter(problem => this.filterProblem(problem));
        this.setState({filteredProblemSet: filteredProblems, numberOfPage: Math.ceil(filteredProblems.length / this.state.problemPerPage), currentPage: 1});
    }

    // Function for pagination
    updatePageNumber = (newPage) => {
        this.setState({currentPage: newPage});
    }

    // Functions for sorting
    sortData = () => {
        let sorted = [...this.state.filteredProblemSet];
        sorted.sort((a, b) => {
            if (a[this.state.sortByKey] < b[this.state.sortByKey])
                return (this.state.accending? -1 : 1);
        
            if (a[this.state.sortByKey] > b[this.state.sortByKey])
                return (this.state.accending? 1 : -1);
        
            return 0;
        });
        this.setState({filteredProblemSet: sorted});
    }

    requestSort = (sortKey) => {
        if (sortKey === this.state.sortByKey) this.setState({accending: !this.state.accending}, this.sortData)
        else this.setState({accending: true, sortByKey: sortKey}, this.sortData);
    }

    componentDidMount() {
        let fakeData = [];
        for (let i = 0; i < 95; i++) {
            fakeData.push({id: i + 1, 
                title: "Problem number " + i, 
                difficulty: Math.ceil(Math.random() * 100), 
                problemPoints: Math.ceil(Math.random() * 1000),
                ranked: (Math.random() > 0.5),
                solved: (Math.random() > 0.5)
            })
        }
        this.setState({problemSet: fakeData, filteredProblemSet: fakeData, numberOfPage: Math.ceil(fakeData.length / this.state.problemPerPage)});
    }


    render() {
        return (<>
            <Container>
                <h1>Problems</h1>
                <Row>
                    <Col xs={2}>
                        <div>Difficulty</div>
                    </Col>
                    <Col xs={4}>
                        <Slider value={this.state.filterDifficulty} onChange={this.updateDifficultyRange} valueLabelDisplay="auto" />
                    </Col>
                    <Selection title=" Rank " update={this.updateRankFilter} selection={[
                        {value: null, label: "No Filter"},
                        {value: false, label: "Pending"},
                        {value: true, label: "Ranked"}
                    ]}/>
                    <Selection title=" Status " update={this.updateStatusFilter} selection={[
                        {value: null, label: "No Filter"},
                        {value: false, label: "Todo"},
                        {value: true, label: "Solved"}
                    ]}/>
                </Row>

                <PageController max={this.state.numberOfPage} size={5} current={this.state.currentPage} update={this.updatePageNumber}/>
                <Table hover>
                <thead>
                    <tr>
                        <th onClick={() => this.requestSort('id')} 
                            style={{cursor: "pointer"}}>#</th>

                        <th onClick={() => this.requestSort('title')}
                            style={{cursor: "pointer"}}>Title</th>

                        <th onClick={() => this.requestSort('difficulty')}
                            style={{cursor: "pointer"}}>Difficulty</th>

                        <th onClick={() => this.requestSort('problemPoints')}
                            style={{cursor: "pointer"}}>PP</th>

                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.filteredProblemSet.map((problem, index) => {
                        const min = (this.state.currentPage - 1) * this.state.problemPerPage;
                        const max = min + this.state.problemPerPage - 1;
                        
                        if (index >= min && index <= max) {
                            return (<tr key={problem.id} style={{borderLeft: problem.solved? '3px solid #00ff00' : ''}}>
                                        <td>{problem.id}</td>
                                        <td><a style={{textDecoration: "none"}} href={"/problem/" + problem.id}>{problem.title}</a></td>
                                        <td><ProgressBar variant="dark" now={problem.difficulty} /></td>
                                    <td>{problem.problemPoints}</td>
                                        <td><Badge variant={problem.ranked? "success": "warning"}>{problem.ranked? "ranked" : "pending"}</Badge></td>
                                    </tr>)
                        } else return undefined;
                    }
                    )}
                </tbody>
                </Table>
            </Container>
        </>);
    }
}

export default Problems;

