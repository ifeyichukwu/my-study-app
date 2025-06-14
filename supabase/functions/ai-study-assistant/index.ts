
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = 'chat' } = await req.json();
    
    console.log('AI Study Assistant request:', { type, messageCount: messages?.length });

    let systemMessage;
    if (type === 'quiz') {
      systemMessage = {
        role: 'system',
        content: `You are an expert quiz generator. Create multiple choice questions based on the provided content. 
        Format your response as a JSON array of quiz questions, where each question has:
        - question: string
        - options: array of 4 strings (A, B, C, D options)
        - correctAnswer: string (the correct option)
        - explanation: string (brief explanation of the answer)
        
        Example format:
        [
          {
            "question": "What is the main topic discussed?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B",
            "explanation": "Brief explanation why Option B is correct"
          }
        ]
        
        Generate 3-5 questions based on the content provided. Make sure questions test understanding, not just memorization.`
      };
    } else {
      systemMessage = {
        role: 'system',
        content: `You are a helpful AI study assistant. Your role is to:
        - Answer questions about study materials and academic topics
        - Explain concepts clearly and concisely
        - Provide study tips and learning strategies
        - Help with quiz preparation and review
        - Break down complex topics into understandable parts
        
        Always be encouraging and supportive. If you don't know something, admit it and suggest how the student might find the answer.`
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: type === 'quiz' ? 0.7 : 0.8,
        max_tokens: type === 'quiz' ? 2000 : 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-study-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
