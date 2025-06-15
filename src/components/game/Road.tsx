
import React from 'react';
import { ROAD_HEIGHT } from './constants';
import './Road.css';

const Road = () => {
    return (
        <div 
            className="road-container" 
            style={{ height: `${ROAD_HEIGHT}px` }}
        >
            <div className="road-surface" />
            <div className="road-markings" />
        </div>
    );
};

export default Road;
