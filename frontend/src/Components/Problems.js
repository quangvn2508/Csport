import React from 'react';
import { Container, Table, ProgressBar, Button } from 'react-bootstrap';

class Problems extends React.Component {
    state = {
        problemSet: [],
        accending: true,
        sortByKey: 'id'
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
        this.setState({problemSet: [ {id: 1, title: "Hello World!", difficulty: 5, problemPoints: 5, status: "pending"},
                        {id: 2, title: "Hello World!", difficulty: 15, problemPoints: 5, status: "pending"},
                        {id: 3, title: "Hello World!", difficulty: 30, problemPoints: 5, status: "pending"},
                        {id: 4, title: "Hello World!", difficulty: 60, problemPoints: 5, status: "pending"},
                        {id: 5, title: "Hello Worldddddddddddddddddddddddd!", difficulty: 100, problemPoints: 5, status: "pending"}]});
    }
    
    render() {
        return (<>
            <Container>
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

                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.problemSet.map((problem) =>
                        <tr key={problem.id}>
                            <td>{problem.id}</td>
                            <td><a style={{textDecoration: "none"}} href={"#home" + problem.id}>{problem.title}</a></td>
                            <td><ProgressBar now={problem.difficulty} /></td>
                            <td>{problem.problemPoints}</td>
                            <td>{problem.status}</td>
                        </tr>
                    )}
                </tbody>
                </Table>
            </Container>
        </>);
    }
}

export default Problems;

