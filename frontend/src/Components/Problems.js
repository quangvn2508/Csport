import React from 'react';
import { Container, Table, ProgressBar, Badge, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Slider } from "@material-ui/core";

class Problems extends React.Component {
    state = {
        problemSet: [],
        accending: true,
        sortByKey: 'id',
        filterDifficulty: [0, 100],
        filterRank: null,
        filterStatus: null,
    }

    updateDifficultyRange = (event, value) => {
        this.setState({filterDifficulty: value});
    };

    updateRankFilter = (value) => {
        this.setState({filterRank: value});
    }

    updateStatusFilter = (value) => {
        this.setState({filterStatus: value});
    }

    sortData = () => {
        let sorted = [...this.state.problemSet];
        sorted.sort((a, b) => {
            if (a[this.state.sortByKey] < b[this.state.sortByKey])
                return (this.state.accending? -1 : 1);
        
            if (a[this.state.sortByKey] > b[this.state.sortByKey])
                return (this.state.accending? 1 : -1);
        
            return 0;
        });
        this.setState({problemSet: sorted});
    }

    requestSort = (sortKey) => {
        if (sortKey === this.state.sortByKey) this.setState({accending: !this.state.accending}, this.sortData)
        else this.setState({accending: true, sortByKey: sortKey}, this.sortData);
    }

    componentDidMount() {
        this.setState({problemSet: [ {id: 1, title: "Hello World!", difficulty: 5, problemPoints: 5, ranked: true, solved: false},
                        {id: 2, title: "Hello World!", difficulty: 15, problemPoints: 5, ranked: true, solved: true},
                        {id: 3, title: "Hello World!", difficulty: 30, problemPoints: 5, ranked: false, solved: false},
                        {id: 4, title: "Hello World!", difficulty: 60, problemPoints: 5, ranked: true, solved: true},
                        {id: 5, title: "Hello Worldddddddddddddddddddddddd!", difficulty: 100, problemPoints: 5, ranked: false, solved: false}]});
    }

    filterProblem(item) {
        return item.difficulty >= this.state.filterDifficulty[0] && 
            item.difficulty <= this.state.filterDifficulty[1] &&
            (this.state.filterRank === null || item.ranked === this.state.filterRank) && 
            (this.state.filterStatus === null || item.solved === this.state.filterStatus);
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
                        <Slider
                            value={this.state.filterDifficulty}
                            onChange={this.updateDifficultyRange}
                            valueLabelDisplay="auto"
                        />
                    </Col>
                    <Col xs={1}>
                        <DropdownButton variant="outline-secondary" size="sm" title=" Rank ">
                            <Dropdown.Item onClick={()=>this.updateRankFilter(null)}>No Filter</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.updateRankFilter(false)}>Pending</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.updateRankFilter(true)}>Ranked</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col xs={1}>
                        <DropdownButton variant="outline-secondary" size="sm" title=" Status ">
                            <Dropdown.Item onClick={()=>this.updateStatusFilter(null)}>No Filter</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.updateStatusFilter(false)}>Todo</Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.updateStatusFilter(true)}>Solved</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>

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
                    {this.state.problemSet.filter(problem => this.filterProblem(problem)).map((problem) =>
                        <tr key={problem.id} style={{borderLeft: problem.solved? '3px solid #00ff00' : '0px solid #ff0000'}}>
                            <td>{problem.id}</td>
                            <td><a style={{textDecoration: "none"}} href={"#home" + problem.id}>{problem.title}</a></td>
                            <td><ProgressBar variant="dark" now={problem.difficulty} /></td>
                        <td>{problem.problemPoints}</td>
                            <td><Badge variant={problem.ranked? "success": "warning"}>{problem.ranked? "ranked" : "pending"}</Badge></td>
                        </tr>
                    )}
                </tbody>
                </Table>
            </Container>
        </>);
    }
}

export default Problems;

