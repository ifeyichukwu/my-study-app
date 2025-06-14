
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Calendar, BookOpen, Trophy, Clock } from 'lucide-react';

const GroupStudy = () => {
  const studyGroups = [
    {
      name: "Advanced Biology Study Group",
      subject: "Biology",
      members: 12,
      nextSession: "Today, 3:00 PM",
      topic: "Cell Division & Genetics",
      icon: BookOpen,
      status: "active"
    },
    {
      name: "Calculus Problem Solvers",
      subject: "Mathematics",
      members: 8,
      nextSession: "Tomorrow, 7:00 PM",
      topic: "Integration Techniques",
      icon: BookOpen,
      status: "active"
    },
    {
      name: "World History Explorers",
      subject: "History",
      members: 15,
      nextSession: "Friday, 4:30 PM",
      topic: "Renaissance Period",
      icon: BookOpen,
      status: "scheduled"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups with peers who share your academic interests"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Discuss topics, share notes, and ask questions instantly"
    },
    {
      icon: Calendar,
      title: "Scheduled Sessions",
      description: "Organize and attend regular study sessions with your group"
    },
    {
      icon: Trophy,
      title: "Group Challenges",
      description: "Take collaborative quizzes and compete with other study groups"
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Group Study
        </CardTitle>
        <p className="text-gray-600">
          Connect with fellow learners and enhance your studies through collaboration
        </p>
      </CardHeader>
      <CardContent>
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-blue-50/50">
              <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Active Study Groups */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Study Groups</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyGroups.map((group, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <group.icon className="h-6 w-6 text-blue-600" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      group.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{group.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{group.topic}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members} members
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {group.nextSession}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Users className="h-4 w-4 mr-2" />
            Create Study Group
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            <MessageCircle className="h-4 w-4 mr-2" />
            Browse All Groups
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupStudy;
