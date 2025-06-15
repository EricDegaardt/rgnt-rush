
import React from 'react';

const Obstacle = ({ x, width, height, imgSrc }: { x: number; width: number; height: number; imgSrc: string; }) => {
    return (
        <img
            src={imgSrc}
            alt="Obstacle"
            className="absolute"
            style={{
                left: `${x}px`,
                bottom: `80px`, // Road height
                width: `${width}px`,
                height: `${height}px`,
            }}
        />
    );
};

export default Obstacle;
