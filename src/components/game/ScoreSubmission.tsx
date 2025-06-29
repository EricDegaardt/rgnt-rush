import React, { useState } from 'react';
import { Trophy, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveScore } from '@/lib/supabase';
import { toast } from 'sonner';

interface ScoreSubmissionProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const ScoreSubmission = ({ score, selectedBike, onClose, onSubmitted }: ScoreSubmissionProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    
    try {
      console.log('Submitting score:', { username: username.trim(), score, selectedBike });
      const success = await saveScore(username.trim(), score, selectedBike);
      
      if (success) {
        console.log('Score saved successfully');
        setSubmitted(true);
        toast.success('Score saved to leaderboard!');
        setTimeout(() => {
          onSubmitted();
        }, 1500);
      } else {
        console.error('Failed to save score');
        toast.error('Failed to save score. Please try again.');
      }
    } catch (error) {
      console.error('Error saving score:', error);
      toast.error('Failed to save score. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm text-center">
          <div className="text-green-500 mb-4">
            <Trophy className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Score Saved!</h3>
          <p className="text-gray-300">Your score has been added to the leaderboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">New High Score!</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {formatDistance(score)}
          </div>
          <div className="text-gray-300 text-sm">
            Riding: {getBikeDisplayName(selectedBike)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your name
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Skip
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
                'Save Score'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreSubmission;