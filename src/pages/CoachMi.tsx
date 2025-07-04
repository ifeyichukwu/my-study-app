import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Share, 
  Edit, 
  Archive, 
  Trash2,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useChatSessions, ChatSession } from '@/hooks/useChatSessions';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const CoachMi = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { 
    sessions, 
    createSession, 
    updateSession, 
    deleteSession, 
    archiveSession 
  } = useChatSessions();
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Initialize with welcome message when no session is selected
  useEffect(() => {
    if (!currentSessionId) {
      setMessages([
        {
          id: '1',
          content: `Hello! I'm CoachMi, your AI Study Coach. I specialize in helping you optimize your learning strategies, manage your time effectively, and develop sustainable study habits.

I can help you with:
• 📊 Analyzing your study patterns and performance
• ⏰ Creating personalized study schedules and routines
• 🎯 Setting and tracking academic goals
• 📈 Identifying your learning strengths and areas for improvement
• 🧠 Recommending study techniques based on your learning style
• ⚖️ Balancing study time across different subjects
• 💪 Building motivation and overcoming procrastination

What aspect of your studies would you like to work on today?`,
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentSessionId]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages || []);
      }
    }
  }, [currentSessionId, sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    let sessionId = currentSessionId;
    
    // Create new session if none selected and user is authenticated
    if (!sessionId && user) {
      try {
        const newSession = await createSession.mutateAsync('CoachMi Chat');
        sessionId = newSession.id;
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = {
        profile: profile,
        userMessage: `As CoachMi, the study coach specialist: ${inputValue}`,
        recentSessions: [], // TODO: Add recent sessions data
      };

      const { data, error } = await supabase.functions.invoke('study-coach', {
        body: context,
      });

      if (error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save messages to session if user is authenticated
      if (sessionId && user) {
        updateSession.mutate({ 
          id: sessionId, 
          messages: finalMessages,
          title: finalMessages.length === 2 ? `CoachMi: ${inputValue.slice(0, 40)}...` : undefined
        });
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

  const handleNewChat = async () => {
    if (user) {
      try {
        const newSession = await createSession.mutateAsync('CoachMi Chat');
        setCurrentSessionId(newSession.id);
        setMessages([]);
      } catch (error) {
        console.error('Failed to create new chat:', error);
      }
    } else {
      // For non-authenticated users, just reset the chat
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const handleSessionSelect = (session: ChatSession) => {
    setCurrentSessionId(session.id);
  };

  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingSessionId && editingTitle.trim()) {
      updateSession.mutate({ 
        id: editingSessionId, 
        title: editingTitle.trim() 
      });
    }
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleShareSession = (sessionId: string) => {
    navigator.clipboard.writeText(`CoachMi Session: ${sessionId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sidebar component
  const ChatSidebar = () => (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sidebar-foreground">CoachMi</span>
        </div>
        <Button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Coaching Session
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {sessions.filter(s => s.title.includes('CoachMi')).map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`}
              onClick={() => handleSessionSelect(session)}
            >
              <div className="flex-1 min-w-0">
                {editingSessionId === session.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveRename}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()}
                    className="h-6 text-sm bg-transparent border-none p-0 focus:ring-0"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm truncate text-sidebar-foreground">
                    {session.title}
                  </p>
                )}
                <p className="text-xs text-sidebar-foreground/60">
                  {new Date(session.updated_at).toLocaleDateString()}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShareSession(session.id)}>
                    <Share className="h-3 w-3 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRenameSession(session.id, session.title)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => archiveSession.mutate(session.id)}>
                    <Archive className="h-3 w-3 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteSession.mutate(session.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-border flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                CoachMi - Your Study Coach
              </h1>
            </div>
            {!user && (
              <div className="ml-auto text-sm text-muted-foreground">
                <span>Sign in to save coaching sessions</span>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback>
                        <Target className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
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
                    <Avatar className="h-8 w-8 bg-secondary">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback>
                      <Target className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask CoachMi about study strategies, time management, goals..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CoachMi;