
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar } from 'lucide-react';

interface Course {
  id: string;
  course_code: string;
  course_title: string;
  department: string;
}

interface PastQuestion {
  id: string;
  question_text: string;
  academic_session: string;
  question_type: string;
  exam_type: string;
  marks: number;
  question_number: number;
  created_at: string;
  courses: Course;
  question_answers?: {
    answer_text: string;
    explanation: string;
    key_points: any;
  };
}

interface QuestionCardProps {
  question: PastQuestion;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-blue-800">
              {question.courses?.course_code} - {question.courses?.course_title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{question.academic_session}</Badge>
              {question.question_type && (
                <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
              )}
              {question.exam_type && (
                <Badge variant="outline">{question.exam_type}</Badge>
              )}
              {question.marks && (
                <Badge>{question.marks} marks</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(question.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Question:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{question.question_text}</p>
          </div>
          
          {question.question_answers && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-800">AI Generated Answer:</h4>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {question.question_answers.answer_text}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
