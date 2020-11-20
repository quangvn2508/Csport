import { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Login from './Login';
import Cookie from 'js-cookie';
import { JWT_KEY } from './../config';

function Navigation() {
    const [show, setShow] = useState(false);

    return (
        <>
            <Navbar expand="sm" bg="dark" variant="dark">
            <Navbar.Brand href="/">Csport</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/problems">Problems</Nav.Link>
                    <Nav.Link href="/rank">Ranking</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="#Profile" onClick={() => Cookie.remove(JWT_KEY)}>Profile</Nav.Link> {/* TODO: profile page */}
                    <Nav.Link onClick={() => setShow(true)}>Join us</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
            <Login show={show} setShow={setShow}/>
        </>
    );
}

export default Navigation;