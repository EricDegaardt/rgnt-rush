import React, { useState } from 'react';
import { Share2, X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareScoreProps {
  score: number;
  onClose: () => void;
}

const ShareScore = ({ score, onClose }: ShareScoreProps) => {
  const [copied, setCopied] = useState(false);
  
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
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent('Check out my RGNT RUSH score!')}&body=${encodeURIComponent(shareText + '\n\n' + gameUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
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
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Share Your Score!</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-all duration-200"
          >
            <X size={24} />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">{Math.floor(score)}m</div>
          <p className="text-gray-300 text-sm">Amazing ride! Share your achievement:</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              onClick={() => handleShare(option.url)}
              className={`${option.color} text-white flex items-center justify-center h-12`}
            >
              <span className="text-sm">{option.name}</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={handleCopyLink}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 h-12"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
};

export default ShareScore;