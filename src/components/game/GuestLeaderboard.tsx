
import React from 'react';
import { useGuestScores } from '@/hooks/useGuestScores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface GuestLeaderboardProps {
  onClose: () => void;
  currentScore?: number;
}

const GuestLeaderboard = ({ onClose, currentScore }: GuestLeaderboardProps) => {
  const { getTopScores } = useGuestScores();
  const scores = getTopScores();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>;
    }
  };

  const shareScore = async (score: number) => {
    const shareText = `🏍️ I just scored ${score} points in RGNT RUSH! Can you beat my score? Play now!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RGNT RUSH - Check out my score!',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Score copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-2 border-purple-500 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl text-center text-purple-400">
            Local Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scores.length === 0 ? (
            <div className="text-center text-gray-400">
              No scores yet. Be the first to play!
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    currentScore && entry.score === currentScore
                      ? 'bg-purple-600'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div>
                      <div className="text-white font-semibold">Anonymous Player</div>
                      <div className="text-xs text-gray-400">
                        {entry.bikeUsed} • {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{entry.score.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{entry.distance}m</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentScore && (
            <div className="pt-4 border-t border-gray-700">
              <Button
                onClick={() => shareScore(currentScore)}
                className="w-full bg-green-600 hover:bg-green-700 mb-2"
              >
                Share Your Score 🚀
              </Button>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-purple-500 hover:bg-purple-700"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestLeaderboard;
