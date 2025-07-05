
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Users, MessageCircle, Calendar, Mail, Github, Twitter, Linkedin, Heart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GenerateQuizModal from '@/components/GenerateQuizModal';
import QuickStartTutorial from '@/components/QuickStartTutorial';
import Testimonials from '@/components/Testimonials';
import RecentActivity from '@/components/RecentActivity';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            Welcome to ScholarMi
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            Transform your learning with AI-powered quiz generation. Upload your materials, generate personalized quizzes, and accelerate your educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/library')}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto text-sm sm:text-base"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upload Your First Document
                </Button>
                <div className="w-full sm:w-auto">
                  <GenerateQuizModal lessonContent="Welcome to ScholarMi - a platform for AI-powered quiz generation from your study materials." />
                </div>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto text-sm sm:text-base"
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Get Started - Sign Up Free
              </Button>
            )}
          </div>
        </div>

        {/* Quick Start Tutorial */}
        <div className="mb-8 lg:mb-12">
          <QuickStartTutorial />
        </div>

        {/* Recent Activity */}
        <div className="mb-8 lg:mb-16">
          <RecentActivity />
        </div>

        {/* Enhanced Testimonials Section */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
              Trusted by Students & Educators Worldwide
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Join thousands of learners who have transformed their study experience with ScholarMi
            </p>
          </div>
          <Testimonials />
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-white mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">Ready to Transform Your Learning?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">Start generating personalized quizzes from your study materials today</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/library')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base"
                >
                  Upload Documents
                </Button>
                <Button 
                  onClick={() => navigate('/quiz-generator')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base"
                >
                  Try Demo Quiz
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base"
                >
                  Get Started Free
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base"
                >
                  Try Demo Quiz
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
