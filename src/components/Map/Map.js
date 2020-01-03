import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Map() {


    useEffect(() => {
        fetchItems();
    }, []);
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const serviceCall = await fetch('http://localhost:5000/api/v1/stores');
        const items = await serviceCall.json();
        console.log(items.data);
        setItems(items.data);
    }

    return (
        <div>
            {items.map(item => (
                <div key={item.storeId}>
                    <Link to={`/location/${item.storeId}`}>
                        <h1>{item.storeId}</h1>
                        <h2>{item.location.formattedAddress}</h2>
                    </Link>
                </div>
            ))}
        </div >
    );
}

export default Map;
