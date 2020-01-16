import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Nav.css'

class NavbarComponent extends React.Component {

    state = {
        show: true,
    };

    toggleModal = (val) => {
        this.setState({
            show: val
        })
    };

    render() {

        return (
            <div onClick={e => e.stopPropagation()}>
                <Navbar bg="dark" expand="lg" className="navbar-dark floating-nav-bar">
                    <Navbar.Brand href="#home">We Rinse</Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Button variant="primary" onClick={() => this.toggleModal(true)}>
                                About
                            </Button>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>

                <Modal show={this.state.show} onHide={() => this.toggleModal(false)} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>About <b>We Rinse</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Census of all accumulated trash dumped around your city!</p>
                        <p>
                            How to contribute
                        </p>
                        <ol>
                            <li>Allow anonymous location access</li>
                            <li>Click on the location in map you want to mark as dumped</li>
                            <li>Select the severity </li>
                            <li>Hit Okay to save</li>
                        </ol>


                    </Modal.Body>
                    <Modal.Footer>
                        <small>
                            Made with ❤️ from Chennai <br />
                            React, Express, MongoDb, Mapbox <br />
                            <a href="https://github.com/nirmalkrishnav/we-rinse-app" target="_blank">Github</a>
                        </small>
                        <Button variant="primary" onClick={() => this.toggleModal(false)}>
                            Great Inititative
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
    }

}

export default NavbarComponent;