import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Copy, Check, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase, LeaderboardEntry, saveUserDataLocally, getUserDataFromStorage, UserData } from '@/lib/supabase';
import CelebrationPopup from './CelebrationPopup';

interface LeaderboardModalProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

const LeaderboardModal = ({ score, selectedBike, onClose, onPlayAgain }: LeaderboardModalProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = getUserDataFromStorage();
    if (userData.username) setUsername(userData.username);
    if (userData.email) setEmail(userData.email);
    if (userData.marketingConsent !== undefined) setMarketingConsent(userData.marketingConsent);
  };

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

      // Get total player count
      const { count } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true });
      
      setTotalPlayers(count || 0);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPlayerRank = async (playerScore: number) => {
    try {
      // Count how many players have a higher score
      const { count } = await supabase
        .from('leaderboard')
        .select('*', { count: 'exact', head: true })
        .gt('distance', Math.floor(playerScore));

      const rank = (count || 0) + 1;
      setPlayerRank(rank);

      // Show celebration if player made top 10
      if (rank <= 10) {
        setShowCelebration(true);
      }

      return rank;
    } catch (err) {
      console.error('Error checking player rank:', err);
      return null;
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitScore = async () => {
    if (!username.trim() || !email.trim()) return;
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Save user data locally for future use
      const userData: UserData = {
        username: username.trim(),
        email: email.trim(),
        marketingConsent
      };
      saveUserDataLocally(userData);

      const { error } = await supabase
        .from('leaderboard')
        .insert({
          username: username.trim(),
          email: email.trim(),
          distance: Math.floor(score),
          selected_bike: selectedBike,
          marketing_consent: marketingConsent
        });

      if (error) throw error;

      setHasSubmitted(true);
      
      // Check rank and show celebration if applicable
      const rank = await checkPlayerRank(score);
      
      // Only show share options if not showing celebration
      if (!rank || rank > 10) {
        setShowShareOptions(true);
      }
      
      await fetchLeaderboard(); // Refresh leaderboard after submission
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowShareOptions(true);
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

  const getBikeImage = (bike: string) => {
    const bikeImageUrl = bike === 'purple-rain' 
      ? '/lovable-uploads/purple-rain.png' 
      : '/lovable-uploads/black-thunder.png';
    
    return (
      <img 
        src={bikeImageUrl} 
        alt={bike} 
        className="w-10 h-auto object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    );
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

  // Show celebration popup if player made top 10
  if (showCelebration && playerRank && playerRank <= 10) {
    return (
      <CelebrationPopup
        rank={playerRank}
        totalPlayers={totalPlayers}
        score={score}
        onComplete={handleCelebrationComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      {/* Added proper padding and margins for all screen sizes with higher z-index */}
      <div className="w-full h-full max-w-lg mx-auto flex flex-col p-4 md:p-6 md:py-8 relative z-[10000]">
        <div className="bg-gray-900 rounded-lg w-full flex flex-col overflow-hidden shadow-2xl border border-gray-700" style={{ maxHeight: '100%' }}>
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-4 md:p-6 pb-3 md:pb-4 border-b border-gray-700">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Leaderboard</h3>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">{Math.floor(score)}m</div>
              <p className="text-gray-300 text-sm">Your Distance</p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-3 md:pt-4">
            {!hasSubmitted ? (
              <div className="mb-4 md:mb-6">
                <p className="text-gray-300 text-sm mb-4 text-center">Save your score to the leaderboard:</p>
                <div className="flex flex-col gap-4">
                  {/* Username Input */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                      maxLength={20}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Marketing Consent Checkbox */}
                  <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Checkbox
                      id="marketing-consent"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor="marketing-consent" 
                      className="text-sm text-gray-300 leading-relaxed cursor-pointer"
                    >
                      I agree to receive emails about RGNT RUSH updates, tournaments, and special offers. 
                      <span className="text-gray-400 block mt-1 text-xs">
                        You can unsubscribe at any time. This helps us improve the game and notify you of exciting events!
                      </span>
                    </label>
                  </div>

                  <Button
                    onClick={submitScore}
                    disabled={!username.trim() || !email.trim() || isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Score'}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
                )}
              </div>
            ) : showShareOptions ? (
              <div className="mb-4 md:mb-6">
                <div className="text-center mb-4 md:mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg mb-3 md:mb-4">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Score saved successfully!</span>
                  </div>
                  {playerRank && (
                    <div className="mb-3">
                      <p className="text-purple-400 font-bold text-lg">
                        You ranked #{playerRank} out of {totalPlayers} players!
                      </p>
                    </div>
                  )}
                  <p className="text-gray-300 text-base md:text-lg">Share your achievement:</p>
                </div>

                {/* Share buttons with proper z-index and pointer events */}
                <div className="grid grid-cols-2 gap-3 mb-4 relative z-[10001]">
                  <Button
                    onClick={() => handleShare(shareOptions[0].url)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center h-12 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto"
                  >
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare(shareOptions[1].url)}
                    className="bg-black hover:bg-gray-800 text-white flex items-center justify-center h-12 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto"
                  >
                    X
                  </Button>
                  <Button
                    onClick={() => handleShare(shareOptions[2].url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center h-12 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto"
                  >
                    Facebook
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center h-12 text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto"
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4 md:mb-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Score saved successfully!</span>
                </div>
              </div>
            )}

            <div className="mb-4 md:mb-6">
              <h4 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">Top 10 Riders</h4>
              {isLoading ? (
                <div className="text-center text-gray-400 py-6 md:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  Loading...
                </div>
              ) : error && leaderboard.length === 0 ? (
                <div className="text-center text-red-400 py-6 md:py-8">{error}</div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 md:p-4 rounded-lg transition-all hover:scale-[1.02] ${
                        index < 3 
                          ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-700/30' 
                          : 'bg-gray-800/60 border border-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        {getRankIcon(index)}
                        <div>
                          <div className="text-white font-semibold text-sm md:text-base">{entry.username}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-purple-400 font-bold text-base md:text-lg">{entry.distance}m</div>
                        {getBikeImage(entry.selected_bike)}
                      </div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="text-center text-gray-400 py-6 md:py-8">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg">No scores yet. Be the first!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 md:p-6 pt-3 md:pt-4 border-t border-gray-700">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 md:py-4 text-lg md:text-xl font-bold rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto"
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;