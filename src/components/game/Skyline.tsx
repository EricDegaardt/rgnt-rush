import React from 'react';
import './Skyline.css';

interface SkylineProps {
  isMobile?: boolean;
}

const Skyline = ({ isMobile = false }: SkylineProps) => {
    return (
        <div className="parallax-bg">
            {/* Conditionally hide cloud stripes on mobile for performance */}
            {!isMobile && (
                <>
                    <div className="cloud-stripe"></div>
                    <div className="cloud-stripe"></div>
                    <div className="cloud-stripe"></div>
                </>
            )}
            
            {/* City layers with reduced opacity on mobile */}
            <div 
                id="city-background" 
                style={{ opacity: isMobile ? 0.2 : 0.4 }}
            ></div>
            <div 
                id="city-far" 
                style={{ opacity: isMobile ? 0.3 : 0.6 }}
            ></div>
            <div id="city-near"></div>
            <div 
                id="windows" 
                style={{ opacity: isMobile ? 0.3 : 0.5 }}
            ></div>
        </div>
    );
};

export default Skyline;