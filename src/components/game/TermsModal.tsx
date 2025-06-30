import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10001]">
      <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Terms & Conditions</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-gray-300 leading-relaxed space-y-4">
            <p>
              I agree to receive emails about RGNT Motorcycles updates, news, and special offers. 
              We respect your privacy and will never share, sell, or misuse your email address. 
              You can unsubscribe at any time.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Privacy Policy</h4>
              <p>
                Your personal information will be used solely for the purpose of providing you with 
                updates about RGNT Motorcycles products and services. We are committed to protecting 
                your privacy and maintaining the security of your data.
              </p>
              
              <h4 className="font-semibold text-white">Data Usage</h4>
              <p>
                By providing your email address, you consent to receiving marketing communications 
                from RGNT Motorcycles. You may opt out at any time by clicking the unsubscribe 
                link in any email or contacting us directly.
              </p>
              
              <h4 className="font-semibold text-white">Contact Information</h4>
              <p>
                If you have any questions about these terms or our privacy practices, 
                please contact us through our official website.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Accept Terms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;