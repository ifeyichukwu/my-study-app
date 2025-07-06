import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Send, 
  Video, 
  VideoOff,
  Phone, 
  MoreVertical,
  Users,
  Mic,
  MicOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [participantCount] = useState(3); // Mock participant count
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load group data from localStorage
    const storedGroupData = localStorage.getItem(`group_${groupId}`);
    if (storedGroupData) {
      setGroupData(JSON.parse(storedGroupData));
    } else {
      // If no group data found, redirect back
      navigate('/group-study');
      return;
    }

    // Load existing messages (mock data for now)
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'Alice',
        content: 'Hey everyone! Ready for today\'s study session?',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false
      },
      {
        id: '2',
        sender: 'Bob',
        content: 'Yes! I have some questions about Chapter 5',
        timestamp: new Date(Date.now() - 3000000),
        isOwn: false
      },
      {
        id: '3',
        sender: 'You',
        content: 'Great! Let\'s start with the fundamentals',
        timestamp: new Date(Date.now() - 1800000),
        isOwn: true
      }
    ];
    setMessages(mockMessages);
  }, [groupId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVideoCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsCallMinimized(false);
  };

  const handleShareScreen = () => {
    // Mock share screen functionality
    console.log('Share screen clicked');
  };

  const handleMinimizeForChat = () => {
    setIsCallMinimized(true);
  };

  const handleLearnMiGroup = () => {
    // Mock LearnMi group functionality
    console.log('LearnMi Group clicked');
  };

  if (!groupData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/group-study')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {groupData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-800">{groupData.name}</h2>
                <p className="text-sm text-gray-500">12 members • 8 online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={startVideoCall}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                  <DropdownMenuItem className="hover:bg-blue-50">
                    Share Screen
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50">
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50">
                    LearnMi (Group)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Video Call Overlay */}
        {isInCall && !isCallMinimized && (
          <div className="absolute inset-0 bg-gray-900 z-50 flex flex-col">
            <div className="flex-1 relative">
              {/* Main video area */}
              <div className="h-full bg-gray-800 flex items-center justify-center">
                <div className="text-white text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Video call with {groupData.name}</p>
                  <p className="text-gray-400">{participantCount} participants</p>
                </div>
              </div>
              
              {/* Video controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Phone className="h-5 w-5 rotate-135" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`rounded-full w-12 h-12 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="bg-white border shadow-lg mb-4">
                    <DropdownMenuItem className="hover:bg-blue-50" onClick={handleShareScreen}>
                      Share Screen
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50" onClick={handleMinimizeForChat}>
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50" onClick={handleLearnMiGroup}>
                      LearnMi (Group)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}

        {/* Minimized Video Call */}
        {isInCall && isCallMinimized && (
          <div className="fixed top-4 right-4 z-50 bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-4 w-4" />
              <span className="text-sm">{participantCount} participants</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCallMinimized(false)}
                className="text-white hover:bg-gray-700 p-1"
              >
                <Video className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={endCall}
                className="text-red-400 hover:bg-red-900 p-1"
              >
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isOwn && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`rounded-lg p-3 ${
                  message.isOwn 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {!message.isOwn && (
                    <p className="text-xs text-blue-600 font-medium mb-1">{message.sender}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-blue-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;