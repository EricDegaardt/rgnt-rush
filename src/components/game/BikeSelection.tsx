import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';

interface Bike {
  id: string;
  name: string;
  image: string;
  specs: {
    topSpeed: string;
    mixedRange: string;
    turboPower: string;
    acceleration: string;
    brakingSystem: string;
    batterySystem: string;
    chargeTime: string;
    license: string;
  };
}

const bikes: Bike[] = [
  {
    id: 'purple-rain',
    name: 'Purple Rain',
    image: '/lovable-uploads/purple-rain.png',
    specs: {
      topSpeed: '120 km/h',
      mixedRange: '150 km',
      turboPower: '46 kW',
      acceleration: '4 sec',
      brakingSystem: 'Combined',
      batterySystem: '7.5 kWh',
      chargeTime: '2.1 h (upgradable down to 1h)',
      license: 'A1'
    }
  },
  {
    id: 'black-thunder',
    name: 'Black Thunder',
    image: '/lovable-uploads/black-thunder.png',
    specs: {
      topSpeed: '120 km/h',
      mixedRange: '150 km',
      turboPower: '46 kW',
      acceleration: '4 sec',
      brakingSystem: 'Combined',
      batterySystem: '7.5 kWh',
      chargeTime: '2.1 h (upgradable down to 1h)',
      license: 'A1'
    }
  }
];

interface BikeSelectionProps {
  onBikeSelect: (bikeId: string) => void;
  onBack?: () => void;
}

const BikeSelection = ({ onBikeSelect, onBack }: BikeSelectionProps) => {
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setSelectedBike(bikes[selectedIndex].id);
    };

    onSelect(); // Set initial selection
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleStartGame = () => {
    onBikeSelect(selectedBike);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
      <h2 className="text-2xl md:text-3xl mb-6 text-purple-400">Choose Your Bike</h2>
      
      <div className="w-full max-w-xs mb-6 px-16">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {bikes.map((bike) => (
              <CarouselItem key={bike.id}>
                <div className="p-1">
                  <Card 
                    className={`bg-gray-900 border-2 transition-colors ${
                      selectedBike === bike.id ? 'border-purple-400' : 'border-gray-700'
                    }`}
                  >
                    <CardContent className="flex flex-col items-center p-4">
                      <img 
                        src={bike.image} 
                        alt={bike.name}
                        className="w-48 h-24 object-contain mb-4"
                      />
                      <h3 className="text-xl text-purple-300 mb-4">{bike.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-1 text-xs w-full">
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Top Speed</div>
                          <div className="text-xs">{bike.specs.topSpeed}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Mixed Range</div>
                          <div className="text-xs">{bike.specs.mixedRange}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Turbo Power</div>
                          <div className="text-xs">{bike.specs.turboPower}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Accel 0-100</div>
                          <div className="text-xs">{bike.specs.acceleration}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Braking</div>
                          <div className="text-xs">{bike.specs.brakingSystem}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Battery</div>
                          <div className="text-xs">{bike.specs.batterySystem}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">Charge 20-80%</div>
                          <div className="text-xs leading-tight">{bike.specs.chargeTime}</div>
                        </div>
                        <div className="text-gray-300">
                          <div className="font-semibold text-xs">License</div>
                          <div className="text-xs">{bike.specs.license}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="flex gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleStartGame}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 text-xl animate-pulse"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default BikeSelection;