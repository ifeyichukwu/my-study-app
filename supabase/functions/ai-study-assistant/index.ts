
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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

    // Convert messages to Gemini format and create system prompt
    let prompt = '';
    
    if (type === 'quiz') {
      prompt = `You are an expert quiz generator. Create multiple choice questions based on the provided content. 
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

Generate 3-5 questions based on the content provided. Make sure questions test understanding, not just memorization.

Content to generate quiz from:
${messages[messages.length - 1]?.content || ''}`;
    } else if (type === 'answer') {
      prompt = `You are a helpful AI study assistant. Please provide a detailed, well-structured answer to this academic question.

Format your response with:
1. A direct answer
2. Step-by-step explanation
3. Key concepts involved
4. Any relevant formulas or principles

Make it educational and comprehensive.

Question: ${messages[messages.length - 1]?.content || ''}`;
    } else {
      prompt = `You are a helpful AI study assistant. Your role is to:
- Answer questions about study materials and academic topics
- Explain concepts clearly and concisely
- Provide study tips and learning strategies
- Help with quiz preparation and review
- Break down complex topics into understandable parts

Always be encouraging and supportive. If you don't know something, admit it and suggest how the student might find the answer.

`;
      // Add conversation history for chat
      messages.forEach((msg, index) => {
        if (msg.role === 'user') {
          prompt += `\nUser: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          prompt += `\nAssistant: ${msg.content}`;
        }
      });
      
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        prompt += `\n\nPlease respond to the latest user message.`;
      }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: type === 'quiz' ? 0.7 : 0.8,
          maxOutputTokens: type === 'quiz' ? 2000 : 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    console.log('Gemini response generated successfully');

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
