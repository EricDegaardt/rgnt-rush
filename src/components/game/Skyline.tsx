import React from 'react';
import './Skyline.css';

const Skyline = () => {
    return (
        <div className="parallax-bg">
            {/* Reduced to only 3 cloud stripes */}
            <div className="cloud-stripe"></div>
            <div className="cloud-stripe"></div>
            <div className="cloud-stripe"></div>
            
            {/* City layers */}
            <div id="city-background"></div>
            <div id="city-far"></div>
            <div id="city-near"></div>
            <div id="windows"></div>
        </div>
    );
};

export default Skyline;