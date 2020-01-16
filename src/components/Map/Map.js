import React, { useEffect, useState } from 'react';
import './Map.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Modal, Container, Row, Col } from 'react-bootstrap';

import mapboxgl from 'mapbox-gl';
import axios from 'axios';
const uuidv1 = require('uuid/v1');

mapboxgl.accessToken = 'pk.eyJ1IjoibmlybWFsa3Jpc2huYXYiLCJhIjoiY2s0eWd3ZGs5MDBnajNmbXM3OGRtZmhrbiJ9.qbH0J1Y2ykTeKRuJnNiKtg';

class Map extends React.Component {
    _isMounted = false;

    state = {
        isLoading: true,
        mouseLat: null,
        mouseLng: null,
        dataPoints: null,
        showModal: false,
        mag: 1
    }

    constructor(props) {
        super(props);

        this.state = {
            lng: 80.2707,
            lat: 13.0827,
            zoom: 18,
            dataPoints: null,
            showModal: false,
            mag: 1
        };
    }

    toggleModal = (val) => {
        this.setState({
            showModal: val
        })
    };


    componentDidMount() {
        this._isMounted = true;
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            })
            this.getStores();
        });

    }

    getStores() {
        axios.get(`${process.env.REACT_APP_API_URL}api/v1/stores`)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ dataPoints: res.data })
                this.createMap();
            })
    }

    createMap() {

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
            attributionControl: false,
        });

        const dataPoints = this.state.dataPoints;
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }), 'bottom-right');


        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        map.on('click', (e) => {
            e.preventDefault();

            this.toggleModal(true);
            this.setState({
                mouseLat: e.lngLat.lat,
                mouseLng: e.lngLat.lng
            })
            this.toggleModal(true);
        });


        map.on('load', function () {
            // Add a geojson point source.
            // Heatmap layers also work with a vector tile source.
            map.addSource('earthquakes', {
                'type': 'geojson',
                'data':
                {
                    "type": "FeatureCollection",
                    "features": dataPoints.data
                }
            });

            map.addLayer(
                {
                    'id': 'earthquakes-point',
                    'type': 'circle',
                    'source': 'earthquakes',
                    'minzoom': 7,
                    'paint': {
                        // Size circle radius by earthquake magnitude and zoom level
                        'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                            16,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                        ],
                        // Color circle by earthquake magnitude
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            1,
                            'rgba(33,102,172,0.4)',
                            2,
                            'rgb(103,169,207)',
                            3,
                            'rgb(209,229,240)',
                            4,
                            'rgb(253,219,199)',
                            5,
                            'rgb(239,138,98)',
                            6,
                            'rgb(178,24,43)'
                        ],
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        // Transition from heatmap to circle layer by zoom level
                        'circle-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            0,
                            8,
                            1
                        ]
                    }
                },
                'waterway-label'
            );
        });

    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    changeHandler = event => {

        const magni = parseInt(event.target.value);

        this.setState({
            mag: magni
        });

    }

    resetValues() {
        this.setState({
            mag: 1
        });
    }


    saveLocation() {

        if (this.state.mag === null) {
            return
        }
        console.log(this.state)
        const data = {
            storeId: uuidv1(),
            location: {
                type: 'Feature',
                properties: {
                    mag: this.state.mag,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [this.state.mouseLng, this.state.mouseLat]
                }
            }
        };
        axios.post(`${process.env.REACT_APP_API_URL}api/v1/stores`, data)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.resetValues();
                this.toggleModal(false);
                this.getStores();
            })
    }

    render() {
        return (

            <div>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />


                <Modal show={this.state.showModal} onHide={() => this.toggleModal(false)} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add..</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1" value={this.state.mag}
                                onChange={this.changeHandler} >
                                <Form.Label> Severity</Form.Label>
                                <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.saveLocation()}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default Map;
