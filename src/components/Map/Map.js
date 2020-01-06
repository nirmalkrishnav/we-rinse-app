import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Map.css';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
const uuidv1 = require('uuid/v1');

mapboxgl.accessToken = 'pk.eyJ1IjoibmlybWFsa3Jpc2huYXYiLCJhIjoiY2s0eWd3ZGs5MDBnajNmbXM3OGRtZmhrbiJ9.qbH0J1Y2ykTeKRuJnNiKtg';

class Map extends React.Component {
    _isMounted = false;

    state = {
        isLoading: true,
        mouseLat: null,
        mouseLng: null
    }

    constructor(props) {
        super(props);

        this.state = {
            lng: 80.2707,
            lat: 13.0827,
            zoom: 16,
        };


    }

    componentDidMount() {
        this._isMounted = true;
        console.log(this._isMounted);

        this.getStores();
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.setState({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            })
            this.createMap();
        });

    }

    getStores() {
        axios.get(`${process.env.REACT_APP_API_URL}api/v1/stores`)
            .then(res => {
                console.log(res);
                console.log(res.data);
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
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }), 'bottom-right');


        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        map.on('click', (e) => {
            e.preventDefault();
            this.setState({
                mouseLat: e.lngLat.lat,
                mouseLng: e.lngLat.lng
            })
            if (window.confirm('Do you want to mark this location dirty?')) {
                const data = {
                    storeId: uuidv1(),
                    location: {
                        coordinates: [e.lngLat.lat, e.lngLat.lng]
                    }
                };
                axios.post(`${process.env.REACT_APP_API_URL}api/v1/stores`, data)
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                    })
            }
        });


        map.on('load', function () {
            // Add a geojson point source.
            // Heatmap layers also work with a vector tile source.
            map.addSource('earthquakes', {
                'type': 'geojson',
                'data':
                {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [
                                        [
                                            80.25292217731474,
                                            13.051359608489099
                                        ],
                                        [
                                            80.25218725204468,
                                            13.049985207554927
                                        ],
                                        [
                                            80.25400042533875,
                                            13.050544375397017
                                        ],
                                        [
                                            80.25292217731474,
                                            13.051359608489099
                                        ]
                                    ]
                                ]
                            }
                        }
                    ]
                }
            });

            map.addLayer(
                {
                    'id': 'earthquakes-heat',
                    'type': 'heatmap',
                    'source': 'earthquakes',
                    'maxzoom': 9,
                    'paint': {
                        // Increase the heatmap weight based on frequency and property magnitude
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            0,
                            0,
                            6,
                            1
                        ],
                        // Increase the heatmap color weight weight by zoom level
                        // heatmap-intensity is a multiplier on top of heatmap-weight
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            1,
                            9,
                            3
                        ],
                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        // Begin color ramp at 0-stop with a 0-transparancy color
                        // to create a blur-like effect.
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0,
                            'rgba(33,102,172,0)',
                            0.2,
                            'rgb(103,169,207)',
                            0.4,
                            'rgb(209,229,240)',
                            0.6,
                            'rgb(253,219,199)',
                            0.8,
                            'rgb(239,138,98)',
                            1,
                            'rgb(178,24,43)'
                        ],
                        // Adjust the heatmap radius by zoom level
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            2,
                            9,
                            20
                        ],
                        // Transition from heatmap to circle layer by zoom level
                        'heatmap-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            1,
                            9,
                            0
                        ]
                    }
                },
                'waterway-label'
            );

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
                            'rgba(33,102,172,0)',
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


    // fetchItems = async () => {
    //     const serviceCall = await fetch('http://localhost:5000/api/v1/stores');
    //     const items = await serviceCall.json();
    //     console.log(items.data);
    //     // setItems(items.data);
    // }

    render() {
        return (

            /* {
                   items.map(item => (
                       <div key={item.storeId}>
                           <Link to={`/location/${item.storeId}`}>
                               <h1>{item.storeId}</h1>
                               <h2>{item.location.formattedAddress}</h2>
                           </Link>
                       </div>
                   ))
               } */
            <div>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        );
    }
}

export default Map;
