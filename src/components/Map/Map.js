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
        mouseLng: null,
        dataPoints: null
    }

    constructor(props) {
        super(props);

        this.state = {
            lng: 80.2707,
            lat: 13.0827,
            zoom: 14,
            dataPoints: null
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
                this.setState({ dataPoints: res.data })
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
            this.setState({
                mouseLat: e.lngLat.lat,
                mouseLng: e.lngLat.lng
            })
            if (window.confirm('Do you want to mark this location dirty?')) {
                const data = {
                    storeId: uuidv1(),
                    location: {
                        type: 'Feature',
                        properties: {
                            mag: 3,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [e.lngLat.lng, e.lngLat.lat]
                        }
                    }
                };
                axios.post(`${process.env.REACT_APP_API_URL}api/v1/stores`, data)
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                    })
            }
        });

        console.log(dataPoints);
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
