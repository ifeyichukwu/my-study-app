
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Calendar, BookOpen, Trophy, Clock, Plus, Search } from 'lucide-react';
import JoinGroupModal from '@/components/JoinGroupModal';

const GroupStudy = () => {
  const [selectedGroup, setSelectedGroup] = useState<{ name: string; id: string } | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  const studyGroups = [
    {
      id: 'bio-001',
      name: "Advanced Biology Study Group",
      subject: "Biology",
      members: 12,
      nextSession: "Today, 3:00 PM",
      topic: "Cell Division & Genetics",
      icon: BookOpen,
      status: "active"
    },
    {
      id: 'math-001',
      name: "Calculus Problem Solvers",
      subject: "Mathematics",
      members: 8,
      nextSession: "Tomorrow, 7:00 PM",
      topic: "Integration Techniques",
      icon: BookOpen,
      status: "active"
    },
    {
      id: 'hist-001',
      name: "World History Explorers",
      subject: "History",
      members: 15,
      nextSession: "Friday, 4:30 PM",
      topic: "Renaissance Period",
      icon: BookOpen,
      status: "scheduled"
    },
    {
      id: 'phys-001',
      name: "Physics Lab Partners",
      subject: "Physics",
      members: 6,
      nextSession: "Monday, 2:00 PM",
      topic: "Quantum Mechanics",
      icon: BookOpen,
      status: "active"
    },
    {
      id: 'lit-001',
      name: "Literature Discussion Circle",
      subject: "Literature",
      members: 10,
      nextSession: "Wednesday, 6:00 PM",
      topic: "Modern Poetry Analysis",
      icon: BookOpen,
      status: "scheduled"
    },
    {
      id: 'chem-001',
      name: "Chemistry Study Crew",
      subject: "Chemistry",
      members: 14,
      nextSession: "Thursday, 5:00 PM",
      topic: "Organic Reactions",
      icon: BookOpen,
      status: "active"
    }
  ];

  const handleJoinGroup = (group: any) => {
    setSelectedGroup({ name: group.name, id: group.id });
    setIsJoinModalOpen(true);
  };

  const features = [
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups with peers who share your academic interests and learn together"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Discuss topics, share notes, ask questions, and get instant help from group members"
    },
    {
      icon: Calendar,
      title: "Scheduled Sessions",
      description: "Organize and attend regular study sessions with automatic reminders and calendar integration"
    },
    {
      icon: Trophy,
      title: "Group Challenges",
      description: "Take collaborative quizzes, compete with other study groups, and track your progress together"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Group Study
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with fellow learners, collaborate on challenging topics, and enhance your studies through the power of group learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-5 w-5 mr-2" />
              Create Study Group
            </Button>
            <Button size="lg" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <Search className="h-5 w-5 mr-2" />
              Browse All Groups
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Study Groups */}
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Available Study Groups
              </span>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Search className="h-4 w-4 mr-2" />
                Filter Groups
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <h4 className="font-semibold text-gray-800 mb-1">{group.name}</h4>
                    <p className="text-sm text-blue-600 mb-2">{group.subject}</p>
                    <p className="text-sm text-gray-600 mb-3">{group.topic}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {group.members} members
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {group.nextSession}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleJoinGroup(group)}
                    >
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Your Own Group */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Can't Find Your Subject?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Create your own study group and invite classmates to join. Set your own schedule, choose your topics, and learn together.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="h-5 w-5 mr-2" />
              Start Your Own Group
            </Button>
          </CardContent>
        </Card>

        {/* Join Group Modal */}
        {selectedGroup && (
          <JoinGroupModal
            isOpen={isJoinModalOpen}
            onClose={() => {
              setIsJoinModalOpen(false);
              setSelectedGroup(null);
            }}
            groupName={selectedGroup.name}
            groupId={selectedGroup.id}
          />
        )}
      </div>
    </div>
  );
};

export default GroupStudy;
