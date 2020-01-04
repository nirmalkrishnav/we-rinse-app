import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Nav.css'
function NavbarComponent() {
    return (
        <Navbar bg="dark" expand="lg" className="navbar-dark floating-nav-bar">
            <Navbar.Brand href="#home">We Rinse</Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            {/* <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/home">
                        Home
                        </Link>
                    <Link to="/map">
                        Map
                        </Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse> */}
        </Navbar>
    );
}

export default NavbarComponent;
