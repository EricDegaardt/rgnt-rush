
import React, { useState } from 'react';
import { useGuestScores } from '@/hooks/useGuestScores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Edit } from 'lucide-react';

interface GuestLeaderboardProps {
  onClose: () => void;
  currentScore?: number;
}

const GuestLeaderboard = ({ onClose, currentScore }: GuestLeaderboardProps) => {
  const { getTopScores, username, updateUsername } = useGuestScores();
  const scores = getTopScores();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

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

  const handleSaveUsername = () => {
    updateUsername(tempUsername);
    setIsEditingUsername(false);
  };

  const shareScore = async (score: number) => {
    const playerName = username || 'Anonymous Player';
    const shareText = `🏍️ ${playerName} just scored ${score} points in RGNT RUSH! Can you beat this score? Play now!`;
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
          
          <div className="flex items-center gap-2 justify-center">
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-gray-800 border-gray-600 text-white text-sm"
                  maxLength={20}
                />
                <Button
                  onClick={handleSaveUsername}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">
                  Playing as: {username || 'Anonymous Player'}
                </span>
                <Button
                  onClick={() => {
                    setTempUsername(username);
                    setIsEditingUsername(true);
                  }}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
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
                      <div className="text-white font-semibold">{entry.username}</div>
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
