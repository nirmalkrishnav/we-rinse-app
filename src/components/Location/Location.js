import React, { useEffect, useState } from 'react';
function Location({ match }) {

    useEffect(() => {
        console.log(match)
    }, []);

    return (
        <h1>Location</h1>
    );
}

export default Location;
