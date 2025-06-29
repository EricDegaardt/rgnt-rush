import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

interface LeaderboardModalProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

const LeaderboardModal = ({ score, selectedBike, onClose, onPlayAgain }: LeaderboardModalProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('distance', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const submitScore = async () => {
    if (!username.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('leaderboard')
        .insert({
          username: username.trim(),
          distance: Math.floor(score),
          selected_bike: selectedBike
        });

      if (error) throw error;

      setHasSubmitted(true);
      setShowShareOptions(true); // Show share options after successful submission
      await fetchLeaderboard(); // Refresh leaderboard after submission
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getBikeEmoji = (bike: string) => {
    return bike === 'purple-rain' ? '🟣' : '⚫';
  };

  const shareText = `🏍️ Just scored ${Math.floor(score)}m in RGNT RUSH! Can you beat my score? Play now!`;
  const gameUrl = window.location.href;
  
  const shareOptions = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`,
      color: 'bg-black hover:bg-gray-800'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${gameUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${shareText}\n${gameUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-auto flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Leaderboard</h3>
            <div className="text-3xl font-bold text-purple-400 mb-1">{Math.floor(score)}m</div>
            <p className="text-gray-300 text-sm">Your Distance</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {!hasSubmitted ? (
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4 text-center">Enter your name to save your score:</p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                  maxLength={20}
                  disabled={isSubmitting}
                />
                <Button
                  onClick={submitScore}
                  disabled={!username.trim() || isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </Button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
              )}
            </div>
          ) : showShareOptions ? (
            <div className="mb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg mb-4">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Score saved successfully!</span>
                </div>
                <p className="text-gray-300 text-lg">Share your achievement:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {shareOptions.map((option) => (
                  <Button
                    key={option.name}
                    onClick={() => handleShare(option.url)}
                    className={`${option.color} text-white flex items-center justify-center h-12 text-lg font-medium rounded-lg transition-all transform hover:scale-[1.02]`}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    <span>{option.name}</span>
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={handleCopyLink}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-3 h-12 text-lg font-medium rounded-lg transition-all transform hover:scale-[1.02]"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg">
                <Check className="w-5 h-5" />
                <span className="font-medium">Score saved successfully!</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-xl font-bold text-white mb-4 text-center">Top 10 Riders</h4>
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                Loading...
              </div>
            ) : error && leaderboard.length === 0 ? (
              <div className="text-center text-red-400 py-8">{error}</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-[1.02] ${
                      index < 3 
                        ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-700/30' 
                        : 'bg-gray-800/60 border border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="text-white font-semibold text-lg">{entry.username}</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <span>{getBikeEmoji(entry.selected_bike)}</span>
                          <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-purple-400 font-bold text-xl">{entry.distance}m</div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No scores yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-700">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-xl font-bold rounded-lg transition-all transform hover:scale-[1.02]"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;