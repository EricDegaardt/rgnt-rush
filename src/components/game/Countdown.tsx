import React, { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const lights = [
  { color: 'red', label: '3' },
  { color: 'yellow', label: '2' },
  { color: 'green', label: '1' },
  { color: 'green', label: 'GO!' },
];

const lightColors: Record<string, string> = {
  red: 'bg-red-500 shadow-red-500',
  yellow: 'bg-yellow-400 shadow-yellow-400',
  green: 'bg-green-500 shadow-green-500',
};

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < lights.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 700);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-90 text-white select-none">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          {lights.map((light, idx) => (
            <div
              key={light.label}
              className={`w-20 h-20 rounded-full mx-auto mb-2 transition-all duration-300 shadow-2xl flex items-center justify-center text-4xl font-extrabold ${
                idx === step ? lightColors[light.color] : 'bg-gray-700 opacity-30'
              }`}
              style={{ filter: idx === step ? 'brightness(1.2)' : 'none' }}
            >
              {idx === step && light.label !== 'GO!' ? light.label : ''}
            </div>
          ))}
        </div>
        {lights[step].label === 'GO!' && (
          <div className="text-6xl font-extrabold text-white drop-shadow-lg animate-pulse">GO!</div>
        )}
      </div>
    </div>
  );
};

export default Countdown; 