
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Users, MessageCircle, Calendar, Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenerateQuizModal from '@/components/GenerateQuizModal';
import QuickStartTutorial from '@/components/QuickStartTutorial';
import Testimonials from '@/components/Testimonials';
import RecentActivity from '@/components/RecentActivity';

const Index = () => {
  const navigate = useNavigate();

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
            <Button 
              onClick={() => navigate('/library')}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Your First Document
            </Button>
            <GenerateQuizModal />
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
            <Button 
              onClick={() => navigate('/library')}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={() => navigate('/quiz-generator')}
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Try Demo Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Brand Section */}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Scholar
              </span>
            </div>

            {/* Simple Navigation */}
            <div className="flex space-x-6 text-gray-300 text-sm">
              <a href="/library" className="hover:text-white transition-colors">Library</a>
              <a href="/quiz-generator" className="hover:text-white transition-colors">Quiz Generator</a>
              <a href="/group-study" className="hover:text-white transition-colors">Group Study</a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 Scholar. All rights reserved.</p>
            <div className="flex items-center space-x-1 mt-2 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>for learners everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
