import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
}

const JoinGroupModal = ({ isOpen, onClose, groupName, groupId }: JoinGroupModalProps) => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    if (!username.trim() || !passcode.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate joining process
    setTimeout(() => {
      // Store group data in localStorage for now (in a real app, this would be in a database)
      const groupData = {
        id: groupId,
        name: groupName,
        username: username,
        joinedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`group_${groupId}`, JSON.stringify(groupData));
      
      // Redirect to group chat
      navigate(`/group-chat/${groupId}`);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-800">
            <Users className="h-5 w-5 mr-2" />
            Join {groupName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passcode" className="text-sm font-medium">
              Group Passcode
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="passcode"
                type="password"
                placeholder="Enter group passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinGroup}
            disabled={!username.trim() || !passcode.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {isLoading ? 'Joining...' : 'Join Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;