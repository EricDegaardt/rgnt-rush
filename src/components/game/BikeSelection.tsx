import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';

interface Bike {
  id: string;
  name: string;
  image: string;
  specs: {
    topSpeed: string;
    turboPower: string;
    brakingSystem: string;
    charge: string;
    mixedRange: string;
    accel: string;
    batterySystem: string;
    license: string;
  };
}

const bikes: Bike[] = [
  {
    id: 'purple-rain',
    name: 'PURPLE RAIN',
    image: '/lovable-uploads/purple-rain.png',
    specs: {
      topSpeed: '120 km/h',
      turboPower: '40 kW',
      brakingSystem: 'Combined',
      charge: '2.1 h (upgradable down to 1h)',
      mixedRange: '150 km',
      accel: '4 SEC',
      batterySystem: '7.5 kWh',
      license: 'A1'
    }
  },
  {
    id: 'black-thunder',
    name: 'BLACK THUNDER',
    image: '/lovable-uploads/black-thunder.png',
    specs: {
      topSpeed: '120 km/h',
      turboPower: '40 kW',
      brakingSystem: 'Combined',
      charge: '2.1 h (upgradable down to 1h)',
      mixedRange: '150 km',
      accel: '4 SEC',
      batterySystem: '7.5 kWh',
      license: 'A1'
    }
  }
];

interface BikeSelectionProps {
  onBikeSelect: (bikeId: string) => void;
}

const BikeSelection = ({ onBikeSelect }: BikeSelectionProps) => {
  const [currentBike, setCurrentBike] = useState(bikes[0]);
  const [api, setApi] = useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentBike(bikes[selectedIndex]);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleStartGame = () => {
    onBikeSelect(currentBike.id);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white p-4 text-center relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 8 + 8}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <h1 className="text-4xl md:text-5xl mb-2 text-pink-400 font-bold tracking-wider">
        RGNT RUSH
      </h1>
      
      <div className="bg-pink-500 px-6 py-2 mb-8 transform -skew-x-12">
        <span className="text-yellow-300 font-bold text-lg tracking-wider">
          SELECT RIDE
        </span>
      </div>

      <div className="w-full max-w-md mb-8 relative z-10">
        <Carousel 
          className="w-full" 
          opts={{ align: "center", loop: true }}
          setApi={setApi}
        >
          <CarouselContent>
            {bikes.map((bike) => (
              <CarouselItem key={bike.id} className="flex flex-col items-center">
                <div className="w-80 h-40 flex items-center justify-center mb-4">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="max-w-full max-h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <h2 className="text-2xl font-bold mb-6 tracking-wider">
                  {bike.name}
                </h2>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">TOP SPEED</div>
                    <div className="font-bold">{bike.specs.topSpeed}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">MIXED RANGE</div>
                    <div className="font-bold">{bike.specs.mixedRange}</div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">TURBO POWER</div>
                    <div className="font-bold">{bike.specs.turboPower}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">ACCEL 0-100 KM/H</div>
                    <div className="font-bold">{bike.specs.accel}</div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">BRAKING SYSTEM</div>
                    <div className="font-bold">{bike.specs.brakingSystem}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">BATTERY SYSTEM</div>
                    <div className="font-bold">{bike.specs.batterySystem}</div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">CHARGE 20-80%</div>
                    <div className="font-bold">{bike.specs.charge}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-300 text-xs">LICENSE</div>
                    <div className="font-bold">{bike.specs.license}</div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white bg-opacity-20 border-white border-opacity-40 text-white hover:bg-opacity-30" />
          <CarouselNext className="right-4 bg-white bg-opacity-20 border-white border-opacity-40 text-white hover:bg-opacity-30" />
        </Carousel>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleStartGame}
          className="bg-white text-black font-bold py-3 px-8 rounded text-lg hover:bg-gray-200 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default BikeSelection;
