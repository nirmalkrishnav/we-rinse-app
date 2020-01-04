import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Map.css';
import mapboxgl from 'mapbox-gl';
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


        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.setState({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            })
            this.createMap();
        });

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
        // Add geolocate control to the map.


        map.on('click', (e) => {
            this.setState({
                mouseLat: e.lngLat.lat,
                mouseLng: e.lngLat.lng
            })
            alert(this.state.mouseLat)
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
