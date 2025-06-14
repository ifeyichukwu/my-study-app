
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Brain, TrendingUp } from 'lucide-react';

const RecentActivity = () => {
  // Mock data - in a real app this would come from user's actual activity
  const activities = [
    {
      type: "quiz",
      title: "Biology Chapter 12 Quiz",
      score: "8/10",
      time: "2 hours ago",
      icon: Brain
    },
    {
      type: "upload",
      title: "Physics Notes.pdf",
      action: "Uploaded",
      time: "1 day ago",
      icon: FileText
    },
    {
      type: "achievement",
      title: "Quiz Master",
      action: "Achieved 90% average",
      time: "3 days ago",
      icon: TrendingUp
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-blue-800 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50/50">
              <activity.icon className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{activity.title}</div>
                <div className="text-sm text-gray-600">
                  {activity.score || activity.action} • {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Start using Scholar to see your learning progress here!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
