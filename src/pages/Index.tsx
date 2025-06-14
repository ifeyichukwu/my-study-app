
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Upload, Users, MessageCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenerateQuizModal from '@/components/GenerateQuizModal';
import QuickStartTutorial from '@/components/QuickStartTutorial';
import Testimonials from '@/components/Testimonials';
import RecentActivity from '@/components/RecentActivity';
import GroupStudy from '@/components/GroupStudy';

const Index = () => {
  const navigate = useNavigate();

  const lessonContent = `# The Renaissance Period

The Renaissance was a period of cultural, artistic, political, and economic "rebirth" following the Middle Ages. Generally described as taking place from the 14th century to the 17th century, the Renaissance promoted the rediscovery of classical philosophy, literature and art.

## Key Characteristics:
- **Humanism**: Focus on human potential and achievements
- **Art**: Realistic portrayal of the human form and nature
- **Science**: Emphasis on observation and experimentation
- **Literature**: Revival of classical texts and new forms

## Notable Figures:
- Leonardo da Vinci: Artist, inventor, scientist
- Michelangelo: Sculptor, painter, architect
- Galileo Galilei: Astronomer, physicist
- William Shakespeare: Playwright and poet

## Impact:
The Renaissance laid the foundation for the modern world, influencing art, science, politics, and philosophy for centuries to come.`;

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
            <GenerateQuizModal lessonContent={lessonContent} />
          </div>
        </div>

        {/* Quick Start Tutorial */}
        <QuickStartTutorial />

        {/* Sample Lesson Content */}
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Sample Educational Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700">
              <div className="whitespace-pre-line">{lessonContent}</div>
            </div>
            <div className="mt-6 text-center">
              <GenerateQuizModal lessonContent={lessonContent} />
            </div>
          </CardContent>
        </Card>

        {/* Group Study Section - moved to be next to Quiz Generator */}
        <GroupStudy />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Testimonials */}
        <Testimonials />
      </div>
    </div>
  );
};

export default Index;
