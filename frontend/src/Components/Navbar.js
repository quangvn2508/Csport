import {Navbar, Nav} from 'react-bootstrap';

function Navigation() {
    return (
        <Navbar bg="light" expand="sm">
        <Navbar.Brand href="/">Csport</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/problems">Problems</Nav.Link>
                <Nav.Link href="/rank">Ranking</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="#Login">Join us</Nav.Link>
                <Nav.Link href="#Profil">Profile</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        
    );
}

export default Navigation;