import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
  description?: string;
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
      chargeTime: '2.1 h (upgradable to 1h)',
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
      chargeTime: '2.1 h (upgradable to 1h)',
      license: 'A1'
    }
  },
  {
    id: 'rgnt-turbo',
    name: 'RGNT Turbo',
    image: '/lovable-uploads/rgnt-turbo.png',
    specs: {
      topSpeed: '180–190 km/h',
      mixedRange: '8–10 laps',
      turboPower: '52 kW (push-to-pass)',
      acceleration: 'Multiple power modes',
      brakingSystem: 'Combined',
      batterySystem: 'Quick recharge: 1h',
      chargeTime: '',
      license: 'A1/A'
    },
    description: `RGNT Motorcycles, in collaboration with SVEMO, BIKE, and Dunlop, presents the RGNT TURBO Championship: Sweden's first official EV motorcycle racing series. Race on the RGNT Turbo—an electric powerhouse with multiple power modes and push-to-pass, delivering up to 52 kW peak power. 8–10 lap race capacity. Fully recharged in just 1 hour.`
  }
];

interface BikeSelectionProps {
  onBikeSelect: (bikeId: string) => void;
  onBack?: () => void;
}

const BikeSelection = ({ onBikeSelect, onBack }: BikeSelectionProps) => {
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setSelectedBike(bikes[selectedIndex].id);
      setCurrent(selectedIndex);
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

  const handlePillClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
      <h2 className="text-xl md:text-2xl mb-6 text-purple-400 whitespace-nowrap">Choose Your Bike</h2>
      
      <div className="w-full max-w-md mb-6">
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
                      
                      {bike.description && (
                        <div className="text-[6px] text-gray-300 mb-4 max-h-32 overflow-y-auto pr-2 leading-tight">
                          {bike.description}
                        </div>
                      )}
                      
                      {/* Table format for specifications with different font sizes based on bike type */}
                      <div className={`w-full leading-tight pr-8 ${bike.id === 'rgnt-turbo' ? 'text-[7px]' : 'text-[8px]'}`}>
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Top Speed</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.topSpeed}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Mixed Range</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.mixedRange}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Turbo Power</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.turboPower}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Accel 0–100 km/h</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.acceleration}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Braking System</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.brakingSystem}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Battery System</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.batterySystem}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">Charge 20–80%</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.chargeTime}</td>
                            </tr>
                            <tr>
                              <td className="py-0.5 pr-2 text-gray-300 font-medium whitespace-nowrap">License</td>
                              <td className="py-0.5 text-gray-300 text-right whitespace-nowrap">{bike.specs.license}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Clickable Sliding Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {bikes.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePillClick(index)}
              className={`h-2 w-8 rounded-full transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 ${
                index === current ? 'bg-purple-400' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Select ${bikes[index].name}`}
            />
          ))}
        </div>
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