import {Navbar, Nav} from 'react-bootstrap';

function Navigation() {
    return (
        <Navbar bg="danger" expand="sm">
        <Navbar.Brand href="#home">Csport</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="#problem">Problems</Nav.Link>
                <Nav.Link href="#ranking">Ranking</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="#Hello">Join us</Nav.Link>
                <Nav.Link href="#Hello">Profile</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        
    );
}

export default Navigation;