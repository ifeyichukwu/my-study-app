
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Brain, Home, Library, Users, FileQuestion, User, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/quiz-generator', label: 'Quiz Generator', icon: Brain },
    { path: '/past-questions', label: 'Past Questions', icon: FileQuestion },
    { path: '/group-study', label: 'Group Study', icon: Users },
  ];

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scholar
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
          
          {!authLoading && (
            <>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
