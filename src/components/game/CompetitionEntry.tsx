
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CompetitionEntryProps {
  score: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CompetitionEntry = ({ score, onClose, onSuccess }: CompetitionEntryProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !username) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Store competition entry in localStorage for now
      const competitionEntries = JSON.parse(localStorage.getItem('competitionEntries') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        email,
        username,
        score,
        timestamp: new Date().toISOString(),
      };
      
      competitionEntries.push(newEntry);
      localStorage.setItem('competitionEntries', JSON.stringify(competitionEntries));

      toast({
        title: "Success!",
        description: "You've been entered into the competition! Good luck!",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to enter competition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-purple-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-purple-400">Enter Competition</CardTitle>
          <CardDescription className="text-gray-300">
            Your score: {Math.floor(score)}m
          </CardDescription>
          <CardDescription className="text-gray-300">
            Enter your details to compete for amazing prizes!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Entering...' : 'Enter Competition'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionEntry;
