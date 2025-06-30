import React, { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const countdownSteps = [
  { value: 3, color: 'bg-red-500', label: '3' },
  { value: 2, color: 'bg-yellow-400', label: '2' },
  { value: 1, color: 'bg-yellow-300', label: '1' },
  { value: 0, color: 'bg-green-500', label: 'GO!' },
];

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < countdownSteps.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === countdownSteps.length - 1) {
      const timer = setTimeout(() => onComplete(), 900);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const { color, label } = countdownSteps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="flex flex-col items-center">
        <div
          className={`rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center text-5xl md:text-7xl font-extrabold text-white shadow-2xl mb-6 transition-all duration-300 ${color}`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default Countdown; 