import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StudySession {
  id: string;
  user_id: string;
  document_id: string | null;
  document_title: string;
  session_type: 'document_view' | 'quiz_taken' | 'resource_accessed';
  duration_minutes: number | null;
  score: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: studySessions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as StudySession[];
    },
    enabled: !!user?.id,
  });

  const createStudySession = useMutation({
    mutationFn: async (session: Omit<StudySession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...session,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
    },
  });

  const recordDocumentView = (documentTitle: string, documentId?: string) => {
    createStudySession.mutate({
      document_id: documentId || null,
      document_title: documentTitle,
      session_type: 'document_view',
      duration_minutes: null,
      score: null,
      metadata: {},
    });
  };

  const recordQuizSession = (title: string, score: string, durationMinutes?: number) => {
    createStudySession.mutate({
      document_id: null,
      document_title: title,
      session_type: 'quiz_taken',
      duration_minutes: durationMinutes || null,
      score,
      metadata: {},
    });
  };

  const recordResourceAccess = (resourceTitle: string, resourceType: string, documentId?: string) => {
    createStudySession.mutate({
      document_id: documentId || null,
      document_title: resourceTitle,
      session_type: 'resource_accessed',
      duration_minutes: null,
      score: null,
      metadata: { resource_type: resourceType },
    });
  };

  return {
    studySessions,
    isLoading,
    error,
    recordDocumentView,
    recordQuizSession,
    recordResourceAccess,
  };
};