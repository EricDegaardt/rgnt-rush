import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Copy, Check, Mail, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, LeaderboardEntry, saveUserDataLocally, getUserDataFromStorage, UserData } from '@/lib/supabase';
import CelebrationPopup from './CelebrationPopup';

interface LeaderboardModalProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onPlayAgain: () => void;
  isMobile?: boolean;
}

const LeaderboardModal = ({ score, selectedBike, onClose, onPlayAgain, isMobile = false }: LeaderboardModalProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
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

  const canSubmitScore = () => {
    return username.trim() && email.trim() && marketingConsent && !isSubmitting;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setMarketingConsent(e.target.checked);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setMarketingConsent(!marketingConsent);
  };

  const submitScore = async () => {
    if (!canSubmitScore()) return;
    
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

  // Desktop positioning: top-right corner with smaller size
  const containerClasses = isMobile 
    ? "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
    : "absolute top-4 right-4 w-80 max-h-[calc(100vh-32px)] bg-black bg-opacity-90 rounded-lg shadow-2xl border border-gray-700 z-[9999] backdrop-blur-sm";

  const contentClasses = isMobile
    ? "w-full h-full max-w-lg mx-auto flex flex-col p-4 md:p-6 md:py-8 relative z-[10000]"
    : "w-full h-full flex flex-col relative z-[10000]";

  const cardClasses = isMobile
    ? "bg-gray-900 rounded-lg w-full flex flex-col overflow-hidden shadow-2xl border border-gray-700"
    : "w-full h-full flex flex-col overflow-hidden";

  const headerPadding = isMobile ? "p-4 md:p-6 pb-3 md:pb-4" : "p-3 pb-2";
  const contentPadding = isMobile ? "p-4 md:p-6 pt-3 md:pt-4" : "p-3 pt-2";
  const footerPadding = isMobile ? "p-4 md:p-6 pt-3 md:pt-4" : "p-3 pt-2";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className={cardClasses} style={{ maxHeight: '100%' }}>
          {/* Fixed Header */}
          <div className={`flex-shrink-0 ${headerPadding} border-b border-gray-700`}>
            <div className="text-center">
              <h3 className={`font-bold text-white mb-2 ${isMobile ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                {isMobile ? 'Leaderboard' : 'Achievement'}
              </h3>
              <div className={`font-bold text-purple-400 mb-1 ${isMobile ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                {Math.floor(score)}m
              </div>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                {isMobile ? 'Your Distance' : 'Distance'}
              </p>
              {/* Desktop: Add celebratory elements */}
              {!isMobile && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-400 font-medium">New Score!</span>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-auto ${contentPadding}`}>
            {!hasSubmitted ? (
              <div className={isMobile ? "mb-4 md:mb-6" : "mb-3"}>
                <p className={`text-gray-300 mb-4 text-center ${isMobile ? 'text-sm' : 'text-xs'}`}>
                  Save your score to the leaderboard:
                </p>
                <div className={`flex flex-col ${isMobile ? 'gap-4' : 'gap-3'}`}>
                  {/* Username Input */}
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      className={`w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all ${
                        isMobile ? 'pl-10 pr-4 py-3' : 'pl-8 pr-3 py-2 text-sm'
                      }`}
                      maxLength={20}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all ${
                        isMobile ? 'pl-10 pr-4 py-3' : 'pl-8 pr-3 py-2 text-sm'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Terms & Conditions Section */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                    {/* Terms & Conditions Header - Clickable */}
                    <button
                      onClick={() => setShowTerms(!showTerms)}
                      className={`w-full flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors ${
                        isMobile ? 'p-3' : 'p-2'
                      }`}
                      type="button"
                    >
                      <span className={`font-medium text-gray-300 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        Terms & Conditions
                      </span>
                      {showTerms ? (
                        <ChevronUp className={isMobile ? 'w-4 h-4 text-gray-400' : 'w-3 h-3 text-gray-400'} />
                      ) : (
                        <ChevronDown className={isMobile ? 'w-4 h-4 text-gray-400' : 'w-3 h-3 text-gray-400'} />
                      )}
                    </button>

                    {/* Collapsible Terms Content */}
                    {showTerms && (
                      <div className={`border-t border-gray-700/50 ${isMobile ? 'px-3 pb-3' : 'px-2 pb-2'}`}>
                        <div className={`text-gray-400 leading-relaxed mt-2 ${isMobile ? 'text-xs' : 'text-[10px]'}`}>
                          I agree to receive emails about RGNT Motorcycles updates, news, and special offers. We respect your privacy and will never share, sell, or misuse your email address. You can unsubscribe at any time.
                        </div>
                      </div>
                    )}

                    {/* Checkbox Section - Always Visible */}
                    <div className={`flex items-start space-x-3 border-t border-gray-700/50 ${isMobile ? 'p-3' : 'p-2'}`}>
                      <div className="relative flex-shrink-0 mt-0.5">
                        {/* Hidden native checkbox for accessibility */}
                        <input
                          type="checkbox"
                          id="marketing-consent"
                          checked={marketingConsent}
                          onChange={handleCheckboxChange}
                          disabled={isSubmitting}
                          className={`absolute opacity-0 cursor-pointer ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`}
                          style={{ zIndex: 1 }}
                        />
                        {/* Custom checkbox visual */}
                        <div
                          onClick={handleCheckboxClick}
                          className={`
                            relative flex items-center justify-center border-2 rounded cursor-pointer transition-all duration-200
                            ${isMobile ? 'w-6 h-6 min-w-[24px] min-h-[24px]' : 'w-5 h-5 min-w-[20px] min-h-[20px]'}
                            ${marketingConsent 
                              ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-500/25' 
                              : 'border-gray-500 bg-white hover:border-purple-400 hover:bg-gray-50'
                            }
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
                            focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-opacity-50
                          `}
                        >
                          {marketingConsent && (
                            <Check className={`text-white font-bold stroke-[3] drop-shadow-sm ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                          )}
                        </div>
                      </div>
                      <label 
                        htmlFor="marketing-consent" 
                        className={`text-gray-300 leading-relaxed select-none ${
                          isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${isMobile ? 'text-sm' : 'text-xs'}`}
                        onClick={handleCheckboxClick}
                      >
                        I agree to the Terms & Conditions above
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={submitScore}
                    disabled={!canSubmitScore()}
                    className={`w-full font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none ${
                      isMobile ? 'py-3 text-lg' : 'py-2 text-sm'
                    } ${
                      canSubmitScore() 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Score'}
                  </Button>

                  {/* Validation message */}
                  {(!username.trim() || !email.trim() || !marketingConsent) && (
                    <div className={`text-center text-gray-400 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      {!username.trim() && !email.trim() && !marketingConsent && (
                        <p>Please fill in all fields and agree to the terms</p>
                      )}
                      {(username.trim() && email.trim() && !marketingConsent) && (
                        <p>Please agree to the Terms & Conditions to submit your score</p>
                      )}
                      {(!username.trim() || !email.trim()) && marketingConsent && (
                        <p>Please fill in your username and email</p>
                      )}
                    </div>
                  )}
                </div>
                {error && (
                  <p className={`text-red-400 mt-3 text-center ${isMobile ? 'text-sm' : 'text-xs'}`}>{error}</p>
                )}
              </div>
            ) : showShareOptions ? (
              <div className={isMobile ? "mb-4 md:mb-6" : "mb-3"}>
                <div className={`text-center ${isMobile ? 'mb-4 md:mb-6' : 'mb-3'}`}>
                  <div className={`inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg ${isMobile ? 'mb-3 md:mb-4' : 'mb-2'}`}>
                    <Check className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                    <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}>Score saved successfully!</span>
                  </div>
                  {playerRank && (
                    <div className="mb-3">
                      <p className={`text-purple-400 font-bold ${isMobile ? 'text-lg' : 'text-sm'}`}>
                        You ranked #{playerRank} out of {totalPlayers} players!
                      </p>
                    </div>
                  )}
                  <p className={`text-gray-300 ${isMobile ? 'text-base md:text-lg' : 'text-xs'}`}>
                    Share your achievement:
                  </p>
                </div>

                {/* Share buttons with proper z-index and pointer events */}
                <div className={`grid grid-cols-2 gap-3 mb-4 relative z-[10001] ${isMobile ? '' : 'gap-2'}`}>
                  <Button
                    onClick={() => handleShare(shareOptions[0].url)}
                    className={`bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto ${
                      isMobile ? 'h-12 text-sm' : 'h-8 text-xs'
                    }`}
                  >
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare(shareOptions[1].url)}
                    className={`bg-black hover:bg-gray-800 text-white flex items-center justify-center font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto ${
                      isMobile ? 'h-12 text-sm' : 'h-8 text-xs'
                    }`}
                  >
                    X
                  </Button>
                  <Button
                    onClick={() => handleShare(shareOptions[2].url)}
                    className={`bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto ${
                      isMobile ? 'h-12 text-sm' : 'h-8 text-xs'
                    }`}
                  >
                    Facebook
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    className={`bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-medium rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto ${
                      isMobile ? 'h-12 text-sm' : 'h-8 text-xs'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`text-center ${isMobile ? 'mb-4 md:mb-6' : 'mb-3'}`}>
                <div className={`inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg ${isMobile ? '' : 'text-xs'}`}>
                  <Check className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                  <span className="font-medium">Score saved successfully!</span>
                </div>
              </div>
            )}

            {/* Leaderboard - Only show on mobile or if there's space on desktop */}
            {(isMobile || hasSubmitted) && (
              <div className={isMobile ? "mb-4 md:mb-6" : "mb-3"}>
                <h4 className={`font-bold text-white text-center ${isMobile ? 'text-lg md:text-xl mb-3 md:mb-4' : 'text-sm mb-2'}`}>
                  Top 10 Riders
                </h4>
                {isLoading ? (
                  <div className={`text-center text-gray-400 ${isMobile ? 'py-6 md:py-8' : 'py-4'}`}>
                    <div className={`animate-spin rounded-full border-b-2 border-purple-400 mx-auto mb-2 ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`}></div>
                    <span className={isMobile ? 'text-sm' : 'text-xs'}>Loading...</span>
                  </div>
                ) : error && leaderboard.length === 0 ? (
                  <div className={`text-center text-red-400 ${isMobile ? 'py-6 md:py-8 text-sm' : 'py-4 text-xs'}`}>{error}</div>
                ) : (
                  <div className={isMobile ? "space-y-2 md:space-y-3" : "space-y-1"}>
                    {leaderboard.slice(0, isMobile ? 10 : 5).map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between rounded-lg transition-all hover:scale-[1.02] ${
                          isMobile ? 'p-3 md:p-4' : 'p-2'
                        } ${
                          index < 3 
                            ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-700/30' 
                            : 'bg-gray-800/60 border border-gray-700/30'
                        }`}
                      >
                        <div className={`flex items-center ${isMobile ? 'gap-3 md:gap-4' : 'gap-2'}`}>
                          {getRankIcon(index)}
                          <div>
                            <div className={`text-white font-semibold ${isMobile ? 'text-sm md:text-base' : 'text-xs'}`}>
                              {entry.username}
                            </div>
                            <div className={`text-gray-400 mt-0.5 ${isMobile ? 'text-[10px]' : 'text-[8px]'}`}>
                              {new Date(entry.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className={`text-purple-400 font-bold ${isMobile ? 'text-base md:text-lg' : 'text-xs'}`}>
                            {entry.distance}m
                          </div>
                          <div className={isMobile ? 'w-10' : 'w-6'}>
                            {getBikeImage(entry.selected_bike)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <div className={`text-center text-gray-400 ${isMobile ? 'py-6 md:py-8' : 'py-4'}`}>
                        <Trophy className={`mx-auto mb-3 opacity-50 ${isMobile ? 'w-12 h-12' : 'w-8 h-8'}`} />
                        <p className={isMobile ? 'text-lg' : 'text-xs'}>No scores yet. Be the first!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className={`flex-shrink-0 ${footerPadding} border-t border-gray-700`}>
            <Button
              onClick={onPlayAgain}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] relative z-[10002] pointer-events-auto ${
                isMobile 
                  ? 'py-3 md:py-4 text-lg md:text-xl' 
                  : 'py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 from-gray-700 to-gray-700 hover:from-gray-600 hover:to-gray-600'
              }`}
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