import React from 'react';

const BoltBadge = () => {
  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-50 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Powered by Bolt.new"
    >
      <div className="relative">
        {/* Badge container with responsive sizing */}
        <div className="w-8 h-8 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src="/dist/lovable-uploads/white_circle_360x360.PNG"
            alt="Powered by Bolt.new"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </a>
  );
};

export default BoltBadge;