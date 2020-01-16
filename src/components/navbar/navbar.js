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
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal(false)}>
                            Close </Button>
                        <Button variant="primary" onClick={() => this.toggleModal(false)}>
                            Save Changes  </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
    }

}

export default NavbarComponent;