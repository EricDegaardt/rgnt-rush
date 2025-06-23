
import React from 'react';
import { Share2, Mail, Twitter } from 'lucide-react';

interface SocialShareProps {
  score: number;
  username: string;
  selectedBike: string;
}

const SocialShare = ({ score, username, selectedBike }: SocialShareProps) => {
  const shareText = `🏍️ Just scored ${score}m in RGNT RUSH riding the ${selectedBike.replace('-', ' ')}! Can you beat my score? Play now!`;
  const gameUrl = window.location.origin;

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent('RGNT RUSH - Electric Bike Game')}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out my RGNT RUSH score!');
    const body = encodeURIComponent(`${shareText}\n\nPlay the game here: ${gameUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${gameUrl}`);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-800 rounded-lg w-full max-w-sm mx-auto">
      <h3 className="text-base font-bold text-purple-400 mb-3 text-center">Share Your Score!</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium"
        >
          <Twitter size={14} />
          X (Twitter)
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center justify-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-medium"
        >
          <Share2 size={14} />
          LinkedIn
        </button>
        <button
          onClick={shareViaEmail}
          className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium"
        >
          <Mail size={14} />
          Email
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs font-medium"
        >
          <Share2 size={14} />
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
