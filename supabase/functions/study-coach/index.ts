import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { recentSessions, profile, userMessage } = await req.json();

    // Build context for the AI based on user data
    let contextPrompt = `You are an expert AI Study Coach helping a student optimize their learning. 

Student Profile:
- Name: ${profile?.first_name || 'Student'}
- Course of Study: ${profile?.course_of_study || 'Not specified'}
- Student Type: ${profile?.student_type || 'Not specified'}
- Institution: ${profile?.institution || 'Not specified'}

Recent Study Sessions (last 5):
`;

    if (recentSessions && recentSessions.length > 0) {
      recentSessions.forEach((session: any, index: number) => {
        contextPrompt += `${index + 1}. ${session.session_type}: "${session.document_title}" `;
        if (session.duration_minutes) contextPrompt += `(${session.duration_minutes} min) `;
        if (session.score) contextPrompt += `Score: ${session.score} `;
        contextPrompt += `\n`;
      });
    } else {
      contextPrompt += "No recent study sessions found.\n";
    }

    contextPrompt += `
As a study coach, provide personalized advice, study frameworks, and actionable recommendations. Be encouraging, specific, and practical. Focus on:
- Personalized study techniques based on their profile
- Time management and scheduling
- Learning optimization strategies
- Goal setting and progress tracking
- Subject-specific study methods

User Question: ${userMessage}

Respond in a friendly, encouraging tone. If suggesting study frameworks, be specific about implementation steps.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI Study Coach. You help students create personalized study frameworks, analyze learning patterns, and provide actionable academic guidance. Always be encouraging, specific, and practical in your advice.'
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    // Extract potential study frameworks from the response
    const frameworks = [];
    if (message.toLowerCase().includes('framework') || message.toLowerCase().includes('schedule') || message.toLowerCase().includes('technique')) {
      // Simple framework extraction - in a real app, you might use more sophisticated parsing
      if (message.toLowerCase().includes('pomodoro')) {
        frameworks.push({
          type: 'Time Management',
          title: 'Pomodoro Technique',
          description: 'Study in focused 25-minute intervals with 5-minute breaks',
          actions: ['Set timer', 'Focus study', 'Take breaks', 'Track progress']
        });
      }
      if (message.toLowerCase().includes('spaced repetition')) {
        frameworks.push({
          type: 'Memory',
          title: 'Spaced Repetition',
          description: 'Review material at increasing intervals for better retention',
          actions: ['Initial review', 'Day 1 review', 'Week 1 review', 'Month 1 review']
        });
      }
      if (message.toLowerCase().includes('active recall')) {
        frameworks.push({
          type: 'Learning',
          title: 'Active Recall',
          description: 'Test yourself actively instead of passive re-reading',
          actions: ['Read material', 'Close book', 'Recall key points', 'Check accuracy']
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message,
        frameworks: frameworks.length > 0 ? frameworks : null 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in study-coach function:', error);
    return new Response(
      JSON.stringify({ 
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});