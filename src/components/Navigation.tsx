
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Brain, Home, Library, Users, FileQuestion, User, LogIn, Menu, Bot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/learn-mi', label: 'LearnMi', icon: Brain },
    { path: '/group-study', label: 'Group Study', icon: Users },
    { path: '/study-bot', label: 'CoachMi', icon: Bot },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Always visible */}
        <div className="flex items-center space-x-2 mr-4 sm:mr-8">
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ScholarMi
          </span>
        </div>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 text-sm ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 justify-start w-full ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Auth Section - Always visible but responsive */}
        <div className="flex items-center space-x-2 ml-4 sm:ml-8">
          {!authLoading && (
            <>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm"
                  size="sm"
                >
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm"
                  size="sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
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
