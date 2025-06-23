
import React from 'react';
import { Copy, Mail } from 'lucide-react';

interface SocialShareProps {
  username: string;
  distance: number;
  selectedBike: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ username, distance, selectedBike }) => {
  const shareText = `🏍️ Just crushed ${distance}m in RGNT RUSH! 💨 Riding the ${selectedBike.replace('-', ' ')} through the neon streets! 🌃 Think you can beat my score? 🏁 #RGNTRush #CyberBike`;
  const gameUrl = window.location.origin;

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(gameUrl)}&title=${encodeURIComponent('RGNT RUSH - Cyberpunk Bike Game')}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = '🏍️ Check out my RGNT RUSH score!';
    const body = `${shareText}\n\nPlay the game: ${gameUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
  };

  const copyLink = async () => {
    const textToCopy = `${shareText}\n\nPlay: ${gameUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      // You could add a toast notification here
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-gray-800 border border-purple-500 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-bold text-purple-400 mb-3 text-center">🏍️ Share Your Score!</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={shareToLinkedIn}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium"
        >
          LinkedIn
        </button>
        <button
          onClick={shareToX}
          className="bg-black hover:bg-gray-800 text-white py-2 px-3 rounded text-sm font-medium"
        >
          X (Twitter)
        </button>
        <button
          onClick={shareViaEmail}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-1"
        >
          <Mail size={14} />
          Email
        </button>
        <button
          onClick={copyLink}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium flex items-center justify-center gap-1"
        >
          <Copy size={14} />
          Copy
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
