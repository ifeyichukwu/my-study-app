
import { useState, useEffect } from 'react';
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

export const usePastQuestions = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('courses')
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
      const { data, error } = await (supabase as any)
        .from('past_questions')
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

      const answerData = {
        question_id: questionId,
        answer_text: data?.content || 'Answer could not be generated',
        explanation: 'AI-generated comprehensive answer',
      };

      const { error: answerError } = await (supabase as any)
        .from('question_answers')
        .insert(answerData);

      if (answerError) {
        console.error('Error storing answer:', answerError);
      }

    } catch (error) {
      console.error('Error generating answer:', error);
    }
  };

  const submitQuestion = async (questionData: any) => {
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

      const completeQuestionData = {
        user_id: user.id,
        ...questionData,
      };

      const { data: insertedQuestion, error: questionError } = await (supabase as any)
        .from('past_questions')
        .insert(completeQuestionData)
        .select()
        .single();

      if (questionError) {
        console.error('Error inserting question:', questionError);
        throw questionError;
      }

      if (insertedQuestion) {
        await generateAnswer(insertedQuestion.id, questionData.question_text);
        fetchPastQuestions();
        
        toast({
          title: "Question uploaded successfully",
          description: "AI is generating an answer...",
        });

        return true;
      }
    } catch (error: any) {
      console.error('Error in submitQuestion:', error);
      toast({
        title: "Error uploading question",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPastQuestions();
  }, []);

  return {
    courses,
    pastQuestions,
    loading,
    submitQuestion,
    refetchQuestions: fetchPastQuestions,
  };
};
