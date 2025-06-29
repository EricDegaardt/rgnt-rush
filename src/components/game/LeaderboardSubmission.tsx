import React, { useState } from 'react';
import { Trophy, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveScore } from '@/lib/supabase';

interface LeaderboardSubmissionProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LeaderboardSubmission = ({ score, selectedBike, onClose, onSuccess }: LeaderboardSubmissionProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getBikeDisplayName = (bikeId: string) => {
    switch (bikeId) {
      case 'purple-rain':
        return 'Purple Rain';
      case 'black-thunder':
        return 'Black Thunder';
      default:
        return bikeId;
    }
  };

  const formatDistance = (distance: number) => {
    return distance < 1000 ? `${Math.floor(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting score to leaderboard:', { 
        username: username.trim(), 
        distance: Math.floor(score), 
        selectedBike 
      });
      
      const result = await saveScore(username.trim(), score, selectedBike);
      
      if (result.success) {
        console.log('Score successfully saved to leaderboard');
        setSuccess(true);
        
        // Show success state for 2 seconds, then call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        console.error('Failed to save score to leaderboard:', result.error);
        setError(result.error || 'Failed to save score to leaderboard. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error saving score:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm text-center">
          <div className="text-green-500 mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Score Saved!</h3>
          <p className="text-gray-300 mb-2">Your score has been added to the leaderboard.</p>
          <div className="text-purple-400 font-bold text-lg">
            {formatDistance(score)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">Save to Leaderboard</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            disabled={isSubmitting}
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="text-center mb-6 p-4 bg-purple-900/30 rounded-lg border border-purple-600/30">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {formatDistance(score)}
          </div>
          <div className="text-gray-300 text-sm">
            Riding: {getBikeDisplayName(selectedBike)}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600/50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              maxLength={20}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
              required
              autoFocus
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Max 20 characters</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!username.trim() || isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Save Score
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaderboardSubmission;