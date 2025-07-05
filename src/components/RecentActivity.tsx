
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Brain, Link, Eye } from 'lucide-react';
import { useStudySessions } from '@/hooks/useStudySessions';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const { studySessions, isLoading } = useStudySessions();

  const getActivityIcon = (sessionType: string) => {
    switch (sessionType) {
      case 'quiz_taken':
        return Brain;
      case 'document_view':
        return Eye;
      case 'resource_accessed':
        return Link;
      default:
        return FileText;
    }
  };

  const getActivityDescription = (session: any) => {
    switch (session.session_type) {
      case 'quiz_taken':
        return session.score ? `Score: ${session.score}` : 'Quiz completed';
      case 'document_view':
        return 'Document viewed';
      case 'resource_accessed':
        return `${session.metadata?.resource_type || 'Resource'} accessed`;
      default:
        return 'Activity';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-blue-800 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50/50 animate-pulse">
                <div className="h-8 w-8 bg-blue-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : studySessions.length > 0 ? (
          <div className="space-y-4">
            {studySessions.map((session, index) => {
              const ActivityIcon = getActivityIcon(session.session_type);
              return (
                <div key={session.id || index} className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50/50">
                  <ActivityIcon className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{session.document_title}</div>
                    <div className="text-sm text-gray-600">
                      {getActivityDescription(session)} • {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Start using ScholarMi to see your learning progress here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
