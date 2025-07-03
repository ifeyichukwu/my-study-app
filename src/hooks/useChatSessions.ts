import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export const useChatSessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['chat-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as ChatSession[];
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: async (title: string = 'New Chat') => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('study_chat_sessions')
        .insert({
          user_id: user.id,
          title,
          messages: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({ id, title, messages }: { id: string; title?: string; messages?: any[] }) => {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (messages !== undefined) updateData.messages = messages;

      const { data, error } = await supabase
        .from('study_chat_sessions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_chat_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });

  const archiveSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_chat_sessions')
        .update({ archived: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
    archiveSession,
  };
};