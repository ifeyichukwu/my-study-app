
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Scholar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your learning with AI-powered quiz generation. Upload your materials, generate personalized quizzes, and accelerate your educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/library')}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your First Document
                </Button>
                <GenerateQuizModal lessonContent="Welcome to Scholar - a platform for AI-powered quiz generation from your study materials." />
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Get Started - Sign Up Free
              </Button>
            )}
          </div>
        </div>

        {/* Quick Start Tutorial */}
        <QuickStartTutorial />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Enhanced Testimonials Section */}
        <div className="my-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Trusted by Students & Educators Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their study experience with Scholar
            </p>
          </div>
          <Testimonials />
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">Start generating personalized quizzes from your study materials today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/library')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Upload Documents
                </Button>
                <Button 
                  onClick={() => navigate('/quiz-generator')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Try Demo Quiz
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
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
