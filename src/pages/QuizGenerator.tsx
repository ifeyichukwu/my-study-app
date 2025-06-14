
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Upload, FileText, Sparkles, MessageCircle, BookOpen, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type DocumentContext = {
  fileName: string;
  content: string;
  uploadedAt: Date;
};

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [lessonContent, setLessonContent] = useState('');
  const [userTopics, setUserTopics] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [documentContext, setDocumentContext] = useState<DocumentContext | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setDocumentContext(null);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const buildContextualPrompt = (content: string, isQuizGeneration: boolean = false) => {
    let contextualPrompt = content;

    // Add document context if available
    if (documentContext) {
      contextualPrompt = `DOCUMENT CONTEXT (from ${documentContext.fileName}):\n${documentContext.content}\n\n`;
      contextualPrompt += `USER REQUEST: ${content}`;
    }

    // Add chat history context for quiz generation
    if (isQuizGeneration && chatMessages.length > 0) {
      const recentChatHistory = chatMessages.slice(-6).map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`
      ).join('\n');
      
      contextualPrompt += `\n\nRECENT CONVERSATION HISTORY:\n${recentChatHistory}`;
      contextualPrompt += `\n\nPlease generate quiz questions that incorporate topics from both the provided content and our recent conversation.`;
    }

    return contextualPrompt;
  };

  const handleGenerateQuiz = async () => {
    if (!lessonContent.trim() && !selectedFile) {
      toast({
        title: "Content Required",
        description: "Please provide lesson content or upload a document to generate a quiz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedQuiz(null);

    try {
      let content = lessonContent;
      
      // If file is selected, read its content and store in context
      if (selectedFile) {
        const fileContent = await readFileContent(selectedFile);
        content = fileContent + (lessonContent ? '\n\n' + lessonContent : '');
        
        // Store document context for chat assistant
        setDocumentContext({
          fileName: selectedFile.name,
          content: fileContent,
          uploadedAt: new Date()
        });
      }

      if (userTopics.trim()) {
        content += `\n\nAdditional topics to focus on: ${userTopics}`;
      }

      // Build contextual prompt that includes chat history
      const contextualPrompt = buildContextualPrompt(
        `Please generate a quiz based on this content:\n\n${content}`,
        true
      );

      const { data, error } = await supabase.functions.invoke('ai-study-assistant', {
        body: {
          messages: [{ role: 'user', content: contextualPrompt }],
          type: 'quiz'
        },
      });

      if (error) throw error;

      try {
        const quizData = JSON.parse(data.content);
        setGeneratedQuiz(quizData);
        
        // Add quiz generation to chat history for context
        setChatMessages(prev => [...prev, 
          { role: 'user', content: `Generated a quiz from: ${selectedFile?.name || 'lesson content'}` },
          { role: 'assistant', content: `I've generated a ${quizData.length}-question quiz covering the key topics from your content.` }
        ]);
        
        toast({
          title: "Quiz Generated!",
          description: `Successfully generated ${quizData.length} questions with contextual awareness.`,
        });
      } catch (parseError) {
        console.error('Failed to parse quiz JSON:', parseError);
        toast({
          title: "Generation Error",
          description: "Failed to generate quiz. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = { role: 'user' as const, content: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      // Build contextual prompt that includes document context
      const contextualPrompt = buildContextualPrompt(currentMessage);

      const { data, error } = await supabase.functions.invoke('ai-study-assistant', {
        body: {
          messages: [...chatMessages, { role: 'user', content: contextualPrompt }],
          type: 'chat'
        },
      });

      if (error) throw error;

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.content 
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'I apologize, but I encountered an error. Please try again.' 
      };
      setChatMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
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
            Generate contextual quizzes and get personalized study assistance that remembers your documents and conversations
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

        {/* Context Indicator */}
        {documentContext && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Context: {documentContext.fileName}
                  </span>
                  <span className="text-xs text-blue-600 ml-2">
                    (Uploaded {documentContext.uploadedAt.toLocaleTimeString()})
                  </span>
                </div>
                <span className="text-xs text-blue-600">
                  AI assistant is aware of this document
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generator' ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                Generate Contextual Quiz
              </CardTitle>
              <CardDescription>
                Upload a document or paste lesson content to generate a custom quiz. The AI will consider your chat history for better context.
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
                <p className="text-xs text-blue-600">
                  Uploaded documents will be available to the chat assistant for contextual responses.
                </p>
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
                    Generating Contextual Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Quiz with AI Context
                  </>
                )}
              </Button>

              {/* Generated Quiz Display */}
              {generatedQuiz && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">
                    Generated Quiz ({generatedQuiz.length} questions)
                  </h3>
                  {generatedQuiz.map((question, index) => (
                    <Card key={index} className="border-blue-200">
                      <CardContent className="p-6">
                        <div className="font-semibold mb-4 text-gray-800">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
                            Question {index + 1}
                          </span>
                          {question.question}
                        </div>
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center text-gray-700">
                              <span className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-sm font-medium mr-3 text-blue-600">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-200">
                          <div className="font-medium">Correct Answer: {question.correctAnswer}</div>
                          <div className="text-sm mt-1">{question.explanation}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-4xl mx-auto h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-3 h-6 w-6 text-purple-600" />
                Context-Aware Study Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about your studies. I remember uploaded documents and our conversation history for better assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Start a conversation with your context-aware AI study assistant!</p>
                    <p className="text-sm mt-2">Ask about concepts, get study tips, or request explanations.</p>
                    {documentContext && (
                      <p className="text-xs mt-2 text-blue-600">
                        I'm aware of your uploaded document: {documentContext.fileName}
                      </p>
                    )}
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
                        <span>Assistant is thinking with context...</span>
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
