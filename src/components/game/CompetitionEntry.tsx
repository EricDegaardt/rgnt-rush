
import React, { useState } from 'react';
import { Mail, Trophy } from 'lucide-react';

interface CompetitionEntryProps {
  onEmailSubmit: (email: string) => Promise<boolean>;
  isSubmitting: boolean;
}

const CompetitionEntry = ({ onEmailSubmit, isSubmitting }: CompetitionEntryProps) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    const success = await onEmailSubmit(email.trim());
    if (success) {
      setSubmitted(true);
    } else {
      setError('Failed to enter competition. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-4 bg-green-800 rounded-lg text-center">
        <Trophy className="mx-auto mb-2" size={24} />
        <h3 className="text-lg font-bold text-green-400 mb-2">Competition Entry Submitted!</h3>
        <p className="text-green-300 text-sm">Good luck! We'll contact you if you win.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-purple-900 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="text-yellow-400" size={20} />
        <h3 className="text-lg font-bold text-purple-400">Enter Competition!</h3>
      </div>
      <p className="text-purple-300 text-sm mb-3">
        Enter your email to participate in our monthly leaderboard competition and win prizes!
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-gray-800 border border-purple-500 p-2 rounded text-white placeholder-gray-400"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-bold ${
            isSubmitting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <Mail size={16} />
          {isSubmitting ? 'Submitting...' : 'Enter Competition'}
        </button>
      </form>
    </div>
  );
};

export default CompetitionEntry;
