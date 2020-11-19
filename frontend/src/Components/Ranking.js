import React from 'react';
import { Container, Table,  Pagination } from 'react-bootstrap';

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



class Ranking extends React.Component {
    state = {
        users: [],
        numberOfPage: 1, // Pagination
        currentPage: 1, // Pagination
        itemPerPage: 10, // Pagination
        user_id: 7
    }

    // Function for pagination
    updatePageNumber = (newPage) => {
        this.setState({currentPage: newPage});
    }

    componentDidMount() {
        let fakeData = [];
        for (let i = 0; i < 95; i++) {
            fakeData.push({id: i + 1, 
                name: "Name " + i, 
                coderpoints: Math.random() * 100
            })
        }

        fakeData.sort((a, b) => {
            return b.coderpoints - a.coderpoints;
        });
        
        this.setState({users: fakeData, numberOfPage: Math.ceil(fakeData.length / this.state.itemPerPage)});
    }


    render() {
        const user_rank = this.state.users.findIndex((user) => user.id === this.state.user_id);

        return (<>
            <Container>
                <h1>Ranking</h1>

                <PageController max={this.state.numberOfPage} size={5} current={this.state.currentPage} update={this.updatePageNumber}/>
                <Table hover borderless>
                <thead>
                    <tr>
                        <th>#</th>

                        <th>Name</th>

                        <th>Coder Points</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map((user, index) => {
                        const min = (this.state.currentPage - 1) * this.state.itemPerPage;
                        const max = min + this.state.itemPerPage - 1;
                        
                        if (index >= min && index <= max) {
                            return (<tr key={user.id}>
                                <td>{index + 1}</td>
                                <td><a style={{textDecoration: "none"}} href={"#user/" + user.id}>{user.name}</a></td>
                                <td>{Math.ceil(user.coderpoints)}</td>
                            </tr>)
                        } else return undefined;
                        
                    })}
                    {user_rank !== -1 && <tr style={{borderTop: 'solid 1px #000000'}}>
                        <td>{user_rank + 1}</td>
                        <td><a style={{textDecoration: "none"}} href={"#user/" + this.state.users[user_rank].id}>{this.state.users[user_rank].name}</a></td>
                        <td>{Math.ceil(this.state.users[user_rank].coderpoints)}</td>
                    </tr>}
                </tbody>
                </Table>
            </Container>
        </>);
    }
}

export default Ranking;

