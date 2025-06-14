
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileQuestion, Upload, Brain, Search, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const PastQuestions = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [questionText, setQuestionText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [academicSession, setAcademicSession] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [examType, setExamType] = useState('');
  const [marks, setMarks] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchPastQuestions();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses' as any)
        .select('*')
        .order('course_code');
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error fetching courses",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCourses(data || []);
      }
    } catch (err) {
      console.error('Error in fetchCourses:', err);
    }
  };

  const fetchPastQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('past_questions' as any)
        .select(`
          *,
          courses (*),
          question_answers (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error fetching questions",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setPastQuestions(data || []);
      }
    } catch (err) {
      console.error('Error in fetchPastQuestions:', err);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !selectedCourse || !academicSession) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload questions",
          variant: "destructive",
        });
        return;
      }

      // Insert the question
      const questionData = {
        user_id: user.id,
        course_id: selectedCourse,
        academic_session: academicSession,
        question_text: questionText,
        question_type: questionType || null,
        exam_type: examType || null,
        marks: marks ? parseInt(marks) : null,
        question_number: questionNumber ? parseInt(questionNumber) : null,
      };

      const { data: insertedQuestion, error: questionError } = await supabase
        .from('past_questions' as any)
        .insert(questionData)
        .select()
        .single();

      if (questionError) {
        console.error('Error inserting question:', questionError);
        throw questionError;
      }

      if (insertedQuestion) {
        // Generate AI answer
        await generateAnswer(insertedQuestion.id, questionText);
        
        // Reset form
        setQuestionText('');
        setSelectedCourse('');
        setAcademicSession('');
        setQuestionType('');
        setExamType('');
        setMarks('');
        setQuestionNumber('');
        
        fetchPastQuestions();
        
        toast({
          title: "Question uploaded successfully",
          description: "AI is generating an answer...",
        });
      }
    } catch (error: any) {
      console.error('Error in handleSubmitQuestion:', error);
      toast({
        title: "Error uploading question",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAnswer = async (questionId: string, questionText: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-assistant', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Please provide a detailed, well-structured answer to this academic question: "${questionText}". 
              
              Format your response with:
              1. A direct answer
              2. Step-by-step explanation
              3. Key concepts involved
              4. Any relevant formulas or principles
              
              Make it educational and comprehensive.`
            }
          ],
          type: 'answer'
        }
      });

      if (error) {
        console.error('Error generating answer:', error);
        return;
      }

      // Store the answer
      const answerData = {
        question_id: questionId,
        answer_text: data?.content || 'Answer could not be generated',
        explanation: 'AI-generated comprehensive answer',
      };

      const { error: answerError } = await supabase
        .from('question_answers' as any)
        .insert(answerData);

      if (answerError) {
        console.error('Error storing answer:', answerError);
      }

    } catch (error) {
      console.error('Error generating answer:', error);
    }
  };

  const filteredQuestions = pastQuestions.filter(q =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.courses?.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.courses?.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Past Questions & AI Answers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload past examination questions and get detailed AI-powered answers to enhance your study experience
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Question</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Browse Questions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <FileQuestion className="h-5 w-5" />
                  <span>Upload Past Question</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
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
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search questions by course code, title, or content..."
                      className="flex-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                {filteredQuestions.map((question) => (
                  <Card key={question.id} className="bg-white/70 backdrop-blur-sm border-blue-200">
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
                ))}
                
                {filteredQuestions.length === 0 && (
                  <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
                    <CardContent className="py-8 text-center">
                      <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? 'No questions found matching your search.' : 'No past questions uploaded yet.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PastQuestions;
