import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star, Zap } from 'lucide-react';

interface CelebrationPopupProps {
  rank: number;
  totalPlayers: number;
  score: number;
  onComplete: () => void;
}

const CelebrationPopup = ({ rank, totalPlayers, score, onComplete }: CelebrationPopupProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show confetti for top 3
    if (rank <= 3) {
      setShowConfetti(true);
    }
    
    // Show message after brief delay
    setTimeout(() => setShowMessage(true), 300);
    
    // Remove auto-close timer - popup will persist until user closes it
  }, [rank]);

  const getCelebrationData = () => {
    if (rank === 1) {
      return {
        icon: <Trophy className="w-16 h-16 text-yellow-500" />,
        title: "🏆 CHAMPION! 🏆",
        message: "You're the ultimate RGNT RUSH rider!",
        subtitle: `New #1 record: ${Math.floor(score)}m`,
        bgGradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
        borderColor: "border-yellow-500",
        textColor: "text-yellow-400",
        confettiColors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500']
      };
    } else if (rank === 2) {
      return {
        icon: <Medal className="w-16 h-16 text-gray-300" />,
        title: "🥈 SILVER LEGEND! 🥈",
        message: "Incredible riding skills!",
        subtitle: `Amazing #2 finish: ${Math.floor(score)}m`,
        bgGradient: "from-gray-400/20 via-gray-300/20 to-gray-500/20",
        borderColor: "border-gray-400",
        textColor: "text-gray-300",
        confettiColors: ['#C0C0C0', '#A8A8A8', '#D3D3D3', '#B8B8B8']
      };
    } else if (rank === 3) {
      return {
        icon: <Award className="w-16 h-16 text-amber-600" />,
        title: "🥉 BRONZE HERO! 🥉",
        message: "Outstanding performance!",
        subtitle: `Solid #3 placement: ${Math.floor(score)}m`,
        bgGradient: "from-amber-600/20 via-orange-600/20 to-yellow-600/20",
        borderColor: "border-amber-600",
        textColor: "text-amber-500",
        confettiColors: ['#CD7F32', '#B8860B', '#DAA520', '#D2691E']
      };
    } else if (rank <= 5) {
      return {
        icon: <Star className="w-16 h-16 text-purple-500" />,
        title: "⭐ TOP 5 ELITE! ⭐",
        message: "You're among the best riders!",
        subtitle: `Excellent #${rank} finish: ${Math.floor(score)}m`,
        bgGradient: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
        borderColor: "border-purple-500",
        textColor: "text-purple-400",
        confettiColors: []
      };
    } else {
      return {
        icon: <Zap className="w-16 h-16 text-blue-500" />,
        title: "⚡ TOP 10 RIDER! ⚡",
        message: "You made it to the leaderboard!",
        subtitle: `Great #${rank} finish: ${Math.floor(score)}m`,
        bgGradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
        borderColor: "border-blue-500",
        textColor: "text-blue-400",
        confettiColors: []
      };
    }
  };

  const celebration = getCelebrationData();

  // Confetti component for top 3
  const ConfettiPiece = ({ color, delay, duration }: { color: string; delay: number; duration: number }) => (
    <div
      className="absolute w-3 h-3 opacity-80"
      style={{
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animation: 'confettiFall linear infinite',
      }}
    />
  );

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] pointer-events-auto">
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes celebrationBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-20px) scale(1.1);
          }
          60% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        
        @keyframes celebrationGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.4);
          }
        }
        
        @keyframes textShimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>

      {/* Confetti for top 3 */}
      {showConfetti && rank <= 3 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece
              key={i}
              color={celebration.confettiColors[i % celebration.confettiColors.length]}
              delay={i * 100}
              duration={3000 + Math.random() * 2000}
            />
          ))}
        </div>
      )}

      {/* Main celebration card */}
      <div 
        className={`relative bg-gradient-to-br ${celebration.bgGradient} border-2 ${celebration.borderColor} rounded-2xl p-8 mx-4 max-w-md w-full text-center transform transition-all duration-1000 ${
          showMessage ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        style={{
          animation: showMessage ? 'celebrationBounce 2s ease-out, celebrationGlow 2s ease-in-out infinite' : 'none'
        }}
      >
        {/* Animated background sparkles for top 3 */}
        {rank <= 3 && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Icon with bounce animation */}
        <div className="mb-6 flex justify-center">
          <div 
            className="transform transition-all duration-500"
            style={{
              animation: showMessage ? 'celebrationBounce 1.5s ease-out' : 'none'
            }}
          >
            {celebration.icon}
          </div>
        </div>

        {/* Title with shimmer effect for top 3 */}
        <h2 
          className={`text-2xl font-bold mb-4 ${celebration.textColor} ${
            rank <= 3 ? 'bg-gradient-to-r from-current via-white to-current bg-clip-text text-transparent bg-size-200 animate-pulse' : ''
          }`}
          style={{
            backgroundSize: '200% auto',
            animation: rank <= 3 ? 'textShimmer 2s linear infinite' : 'none'
          }}
        >
          {celebration.title}
        </h2>

        {/* Message */}
        <p className="text-lg text-white mb-2 font-semibold">
          {celebration.message}
        </p>

        {/* Score subtitle */}
        <p className={`text-base ${celebration.textColor} font-bold mb-6`}>
          {celebration.subtitle}
        </p>

        {/* Stats */}
        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-300">Your Rank</div>
              <div className={`text-xl font-bold ${celebration.textColor}`}>#{rank}</div>
            </div>
            <div>
              <div className="text-gray-300">Total Players</div>
              <div className="text-xl font-bold text-white">{totalPlayers}</div>
            </div>
          </div>
        </div>

        {/* Special messages for different ranks */}
        {rank === 1 && (
          <div className="text-yellow-300 text-sm font-medium mb-4 animate-pulse">
            🎉 You've achieved legendary status! 🎉
          </div>
        )}
        {rank === 2 && (
          <div className="text-gray-300 text-sm font-medium mb-4 animate-pulse">
            ⚡ So close to the top! Keep pushing! ⚡
          </div>
        )}
        {rank === 3 && (
          <div className="text-amber-400 text-sm font-medium mb-4 animate-pulse">
            🔥 Podium finish! You're on fire! 🔥
          </div>
        )}

        {/* Continue button - now the only way to close the popup */}
        <button
          onClick={onComplete}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all transform hover:scale-105 ${
            rank <= 3 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          Continue to Leaderboard
        </button>
      </div>

      {/* Additional sparkle effects for #1 */}
      {rank === 1 && showMessage && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-2xl opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CelebrationPopup;