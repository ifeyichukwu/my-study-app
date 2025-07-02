import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2, Brain, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useProfile } from '@/hooks/useProfile';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface StudyFramework {
  type: string;
  title: string;
  description: string;
  actions: string[];
}

const StudyBot = () => {
  const { user } = useAuth();
  const { studySessions } = useStudySessions();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI Study Coach. I'm here to help you create personalized study frameworks, analyze your learning patterns, and guide you toward academic success. 

What would you like to work on today? I can help you with:
• Creating custom study schedules
• Analyzing your recent study sessions
• Suggesting learning techniques
• Setting academic goals
• Reviewing your progress`,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFrameworks, setSuggestedFrameworks] = useState<StudyFramework[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { label: 'Analyze my study patterns', icon: TrendingUp },
    { label: 'Create study schedule', icon: Target },
    { label: 'Review recent sessions', icon: BookOpen },
    { label: 'Suggest study techniques', icon: Brain },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare context for the AI
      const context = {
        recentSessions: studySessions.slice(0, 5),
        profile: profile,
        userMessage: inputValue,
      };

      const response = await fetch('https://goyrkevbtxchqobvwogq.supabase.co/functions/v1/study-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If the AI suggests frameworks, update the suggestions
      if (data.frameworks) {
        setSuggestedFrameworks(data.frameworks);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Study Coach
          </h1>
          <p className="text-xl text-gray-600">
            Get personalized study recommendations and frameworks powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Bot className="h-6 w-6 text-blue-600" />
                  Study Coach Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages Area */}
                <ScrollArea ref={scrollRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className="h-8 w-8 bg-blue-600">
                            <AvatarFallback>
                              <Bot className="h-4 w-4 text-white" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <Avatar className="h-8 w-8 bg-gray-600">
                            <AvatarFallback>
                              <User className="h-4 w-4 text-white" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8 bg-blue-600">
                          <AvatarFallback>
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about study strategies, schedules, or analysis..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction(action.label)}
                    >
                      <action.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Insights */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800">Your Study Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recent Sessions</span>
                    <Badge variant="secondary">{studySessions.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Course Focus</span>
                    <Badge variant="outline">{profile?.course_of_study || 'Not set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Study Type</span>
                    <Badge variant="outline">{profile?.student_type || 'Not set'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Frameworks */}
            {suggestedFrameworks.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-800">Suggested Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestedFrameworks.map((framework, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{framework.type}</Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{framework.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{framework.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {framework.actions.slice(0, 2).map((action, actionIndex) => (
                            <Badge key={actionIndex} variant="secondary" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBot;