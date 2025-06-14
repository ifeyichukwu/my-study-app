
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileQuestion } from 'lucide-react';

interface Course {
  id: string;
  course_code: string;
  course_title: string;
  department: string;
}

interface QuestionUploadFormProps {
  courses: Course[];
  onSubmit: (questionData: any) => Promise<boolean>;
  loading: boolean;
}

const QuestionUploadForm = ({ courses, onSubmit, loading }: QuestionUploadFormProps) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [academicSession, setAcademicSession] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [examType, setExamType] = useState('');
  const [marks, setMarks] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText || !selectedCourse || !academicSession) {
      return;
    }

    const questionData = {
      course_id: selectedCourse,
      academic_session: academicSession,
      question_text: questionText,
      question_type: questionType || null,
      exam_type: examType || null,
      marks: marks ? parseInt(marks) : null,
      question_number: questionNumber ? parseInt(questionNumber) : null,
    };

    const success = await onSubmit(questionData);
    
    if (success) {
      // Reset form
      setQuestionText('');
      setSelectedCourse('');
      setAcademicSession('');
      setQuestionType('');
      setExamType('');
      setMarks('');
      setQuestionNumber('');
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <FileQuestion className="h-5 w-5" />
          <span>Upload Past Question</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course *</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_code} - {course.course_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Academic Session *</label>
              <Select value={academicSession} onValueChange={setAcademicSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2026/2027">2026/2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Type</label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                  <SelectItem value="calculation">Calculation</SelectItem>
                  <SelectItem value="theory">Theory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exam Type</label>
              <Input
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                placeholder="e.g., Final Exam, Mid-term"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Marks</label>
              <Input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g., 20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Text *</label>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the complete question text..."
              rows={6}
              className="resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Uploading...' : 'Upload Question & Generate Answer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionUploadForm;
