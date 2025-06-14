
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Upload, FileText, Sparkles, MessageCircle, BookOpen, X } from 'lucide-react';

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [lessonContent, setLessonContent] = useState('');
  const [userTopics, setUserTopics] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    // TODO: Implement quiz generation with Claude API
    setTimeout(() => {
      setLoading(false);
      // Mock quiz generation result
      alert('Quiz generated successfully! (This will be replaced with actual quiz display)');
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = { role: 'user' as const, content: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setLoading(true);

    // TODO: Implement Claude API call
    setTimeout(() => {
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: 'This is a placeholder response. I will help you with your studies once the Claude API is integrated!' 
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Brain className="mr-4 h-10 w-10 text-purple-600" />
            AI Study Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate quizzes from your content and get personalized study assistance powered by Claude AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <Button
              variant={activeTab === 'generator' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('generator')}
              className="mr-2"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Quiz Generator
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Study Assistant
            </Button>
          </div>
        </div>

        {activeTab === 'generator' ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                Generate Quiz From Content
              </CardTitle>
              <CardDescription>
                Upload a document or paste lesson content to generate a custom quiz with AI assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Upload Document (Optional)</Label>
                <div className="mt-1">
                  <input
                    id="quiz-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="quiz-file"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-700 truncate">
                            {selectedFile.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="ml-2 p-1 h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Choose document to generate quiz from (PDF, DOC, DOCX, TXT)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Lesson Content Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Lesson Content</Label>
                <Textarea
                  placeholder="Paste your lesson content here or leave empty if uploading a document..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  disabled={loading}
                  rows={6}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              {/* Additional Topics Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Additional Topics (Optional)</Label>
                <Textarea
                  placeholder="Add extra topics or specific areas to focus on..."
                  value={userTopics}
                  onChange={(e) => setUserTopics(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <Button 
                onClick={handleGenerateQuiz} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Quiz with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-4xl mx-auto h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-3 h-6 w-6 text-purple-600" />
                AI Study Assistant Chat
              </CardTitle>
              <CardDescription>
                Ask questions about your studies, get explanations, and receive personalized learning guidance.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Start a conversation with your AI study assistant!</p>
                    <p className="text-sm mt-2">Ask about concepts, get study tips, or request explanations.</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 border'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                        <span>Assistant is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !currentMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
