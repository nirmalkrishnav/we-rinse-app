import React, { useEffect } from 'react';
function Map() {

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const data = await fetch('http://localhost:5000/api/v1/stores');
        console.log(data);
    }

    return (
        <h1>Map</h1>
    );
}

export default Map;
