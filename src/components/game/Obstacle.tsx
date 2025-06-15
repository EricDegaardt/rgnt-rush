
import React from 'react';
import TransparentImage from './TransparentImage';

const Obstacle = ({ x, width, height, imgSrc }: { x: number; width: number; height: number; imgSrc: string; }) => {
    return (
        <TransparentImage
            src={imgSrc}
            alt="Obstacle"
            className="absolute"
            style={{
                left: `${x}px`,
                bottom: `80px`, // Road height
                width: `${width}px`,
                height: `${height}px`,
                objectFit: 'contain',
            }}
        />
    );
};

export default Obstacle;
