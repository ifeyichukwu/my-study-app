
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileQuestion, Upload, Search } from 'lucide-react';
import { usePastQuestions } from '@/hooks/usePastQuestions';
import QuestionUploadForm from '@/components/QuestionUploadForm';
import QuestionCard from '@/components/QuestionCard';
import QuestionSearch from '@/components/QuestionSearch';

const PastQuestions = () => {
  const { courses, pastQuestions, loading, submitQuestion } = usePastQuestions();
  const [searchTerm, setSearchTerm] = useState('');

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
            <QuestionUploadForm 
              courses={courses}
              onSubmit={submitQuestion}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-6">
              <QuestionSearch 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              <div className="grid gap-6">
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
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
