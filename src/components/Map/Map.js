import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Map.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoibmlybWFsa3Jpc2huYXYiLCJhIjoiY2s0eWd3ZGs5MDBnajNmbXM3OGRtZmhrbiJ9.qbH0J1Y2ykTeKRuJnNiKtg';

class Map extends React.Component {
    _isMounted = false;

    state = {
        isLoading: true
    }

    constructor(props) {
        super(props);
        this.state = {
            lng: -122.447303,
            lat: 37.753574,
            zoom: 12,
        };
    }

    componentDidMount() {
        this._isMounted = true;
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
        // Add geolocate control to the map.
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            })
        );
        // map.on('move', () => {
        //     this.setState({
        //         lng: map.getCenter().lng.toFixed(4),
        //         lat: map.getCenter().lat.toFixed(4),
        //         zoom: map.getZoom().toFixed(2)
        //     });
        // });

        // map.on('load', () => {
        //     map.addLayer({
        //         'id': 'population',
        //         'type': 'circle',
        //         'source': {
        //             type: 'vector',
        //             url: 'mapbox://examples.8fgz4egr'
        //         },
        //         'source-layer': 'sf2010',
        //         'paint': {
        //             // make circles larger as the user zooms from z12 to z22
        //             'circle-radius': {
        //                 'base': 1.75,
        //                 'stops': [
        //                     [12, 2],
        //                     [22, 180]
        //                 ]
        //             },
        //             // color circles by ethnicity, using a match expression
        //             // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
        //             'circle-color': [
        //                 'match',
        //                 ['get', 'ethnicity'],
        //                 'White',
        //                 '#fbb03b',
        //                 'Black',
        //                 '#223b53',
        //                 'Hispanic',
        //                 '#e55e5e',
        //                 'Asian',
        //                 '#3bb2d0',
        //     /* other */ '#ccc'
        //             ]
        //         }
        //     });
        // });
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
