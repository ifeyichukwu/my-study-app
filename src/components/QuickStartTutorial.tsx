
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Brain, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickStartTutorial = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Upload,
      title: "Upload Content",
      description: "Upload your documents, notes, or paste lesson content",
      action: "Go to Library",
      route: "/library"
    },
    {
      icon: Brain,
      title: "Generate Quiz",
      description: "Let AI create personalized quiz questions from your material",
      action: "Quiz Generator",
      route: "/quiz-generator"
    },
    {
      icon: Play,
      title: "Start Learning",
      description: "Take your custom quiz and track your progress",
      action: "Try Now",
      route: "/quiz-generator"
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-blue-800 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 mr-2" />
          Quick Start Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
              <Button 
                onClick={() => navigate(step.route)}
                variant="outline" 
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {step.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartTutorial;
