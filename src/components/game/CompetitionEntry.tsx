
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGuestScores } from '@/hooks/useGuestScores';

interface CompetitionEntryProps {
  score: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CompetitionEntry = ({ score, onClose, onSuccess }: CompetitionEntryProps) => {
  const { username } = useGuestScores();
  const [formData, setFormData] = useState({
    username: username || '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Competition entry submitted:', {
        ...formData,
        score,
        submittedAt: new Date().toISOString()
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting competition entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-2 border-green-500 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center text-green-400">
            Enter Competition
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">
            Your score: <span className="text-green-400 font-bold">{score.toLocaleString()}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Enter your username"
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="text-white">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Any message for the competition..."
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionEntry;
