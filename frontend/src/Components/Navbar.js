import { Navbar, Nav } from 'react-bootstrap';
import Login from './Login';
import { connect } from 'react-redux';
import { setJwt, removeJwt, showLoginPanel, addMessage } from '../redux/actions';

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

const mapDipatchToProps = {
    setJwt,
    removeJwt,
    showLoginPanel,
    addMessage
}

function Navigation(props) {
    return (
        <>
            <Navbar expand="sm" bg="dark" variant="dark">
            <Navbar.Brand href="/">Csport</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/problems">Problems</Nav.Link>
                    <Nav.Link href="/createProblem">Contribute</Nav.Link>
                    {/* <Nav.Link href="/rank">Ranking</Nav.Link> */}
                </Nav>
                <Nav>
                    {   props.jwt !== undefined?
                        <Nav.Link href="#" onClick={() => {
                            props.removeJwt();
                            props.addMessage('Logged out');
                        }}>Logout</Nav.Link> : 
                        <Nav.Link onClick={() => props.showLoginPanel(true)}>Join us</Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
            </Navbar>
            <Login/>
        </>
    );
}

export default connect(mapStateToProps, mapDipatchToProps)(Navigation);