import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, FileQuestion, FileText, Send, Loader2, Sparkles, Copy, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  mode: 'quiz' | 'questions' | 'assignment';
  timestamp: Date;
}

const LearnMi = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'quiz' | 'questions' | 'assignment'>('quiz');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modes = [
    {
      value: 'quiz',
      label: 'Quiz Generator',
      icon: Brain,
      description: 'Generate interactive quizzes from your content',
      color: 'bg-blue-500',
    },
    {
      value: 'questions',
      label: 'Past Questions',
      icon: FileQuestion,
      description: 'Get exam-style questions and answers',
      color: 'bg-green-500',
    },
    {
      value: 'assignment',
      label: 'Assignment Writer',
      icon: FileText,
      description: 'Create assignments and essays',
      color: 'bg-purple-500',
    },
  ] as const;

  const currentMode = modes.find(m => m.value === mode) || modes[0];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use LearnMi",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      type: 'user',
      content: input.trim(),
      mode,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response based on mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiResponse = '';
      switch (mode) {
        case 'quiz':
          aiResponse = generateQuizResponse(input);
          break;
        case 'questions':
          aiResponse = generateQuestionsResponse(input);
          break;
        case 'assignment':
          aiResponse = generateAssignmentResponse(input);
          break;
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        type: 'assistant',
        content: aiResponse,
        mode,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuizResponse = (input: string) => {
    return `**Quiz Generated: ${input}**

**Question 1:** What is the main concept discussed in the provided content?
a) Option A
b) Option B  
c) Option C
d) Option D

**Answer:** C) Option C

**Question 2:** Which of the following best describes...?
a) First option
b) Second option
c) Third option  
d) Fourth option

**Answer:** B) Second option

**Question 3:** True or False: The statement about the topic is correct.

**Answer:** True

*Generated 3 questions based on your input. Would you like more questions or different difficulty levels?*`;
  };

  const generateQuestionsResponse = (input: string) => {
    return `**Past Questions Analysis: ${input}**

**Common Exam Patterns:**
1. Definition-based questions (40%)
2. Application problems (35%)
3. Critical thinking questions (25%)

**Sample Questions:**

**Q1:** Define and explain the key concepts related to ${input}.
*Typical Answer Format: Definition, explanation, examples, applications*

**Q2:** Compare and contrast different approaches to ${input}.
*Key Points: Similarities, differences, advantages, disadvantages*

**Q3:** Analyze the impact of ${input} in real-world scenarios.
*Expected Response: Analysis, evidence, conclusions, implications*

*These questions are based on common exam patterns. Would you like specific past papers or more detailed answers?*`;
  };

  const generateAssignmentResponse = (input: string) => {
    return `**Assignment Structure: ${input}**

**Title:** Research Analysis on ${input}

**Outline:**

**I. Introduction (200-300 words)**
- Background context
- Problem statement  
- Research objectives
- Thesis statement

**II. Literature Review (500-700 words)**
- Current research findings
- Key theories and frameworks
- Research gaps identified

**III. Analysis/Discussion (600-800 words)**
- Detailed examination of ${input}
- Critical evaluation
- Supporting evidence and examples

**IV. Conclusion (200-300 words)**
- Summary of key findings
- Implications and recommendations
- Future research directions

**V. References**
- APA/MLA format
- Minimum 8-10 scholarly sources

*Would you like me to elaborate on any section or provide detailed content for specific parts?*`;
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnMi
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI-powered learning assistant for quizzes, questions, and assignments
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {modes.map((modeOption) => (
            <Button
              key={modeOption.value}
              variant={mode === modeOption.value ? "default" : "outline"}
              onClick={() => setMode(modeOption.value)}
              className={`flex items-center gap-2 ${
                mode === modeOption.value 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <modeOption.icon className="h-4 w-4" />
              {modeOption.label}
            </Button>
          ))}
        </div>

        {/* Current Mode Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentMode.color}`}>
                <currentMode.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{currentMode.label}</h3>
                <p className="text-sm text-gray-600">{currentMode.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Chat with LearnMi
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <currentMode.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Ready to help!</p>
                    <p className="text-sm">Ask me to generate {currentMode.label.toLowerCase()} content</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={message.type === 'user' ? 'secondary' : 'outline'} className="text-xs">
                            {message.type === 'user' ? 'You' : 'LearnMi'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {modes.find(m => m.value === message.mode)?.label}
                          </Badge>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {message.content}
                          </pre>
                        </div>
                        {message.type === 'assistant' && (
                          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator />

            {/* Input Area */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask LearnMi to ${currentMode.description.toLowerCase()}...`}
                  className="min-h-[80px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Press Cmd/Ctrl + Enter to send
                  </p>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isLoading ? 'Generating...' : 'Send'}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnMi;