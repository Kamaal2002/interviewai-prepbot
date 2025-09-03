import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { 
      resumeText, 
      jobDescription, 
      questionCount = 5, 
      questionTypes = ['technical', 'behavioral', 'domainSpecific'],
      difficulty = 'mixed',
      userId 
    } = await req.json()

    // Validate input
    if (!resumeText && !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text or job description is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Build the prompt
    let prompt = `Generate ${questionCount} high-quality interview questions for a job candidate. `
    
    if (resumeText) {
      prompt += `Based on this resume: ${resumeText.substring(0, 2000)}... `
    }
    
    if (jobDescription) {
      prompt += `For this job description: ${jobDescription.substring(0, 2000)}... `
    }

    prompt += `\n\nRequirements:
- Generate exactly ${questionCount} questions
- Include a mix of: ${questionTypes.join(', ')} questions
- Difficulty level: ${difficulty}
- Each question should be highly relevant to the candidate's background and the job requirements
- Provide comprehensive answer guidelines for each question
- Questions should be specific and actionable
- Format as JSON array with fields: id (number), text (string), type (string), difficulty (string: "Easy", "Medium", "Hard"), answer (string)

Example JSON format:
[
  {
    "id": 1,
    "text": "Describe a challenging project you worked on and how you overcame obstacles.",
    "type": "Behavioral",
    "difficulty": "Medium",
    "answer": "Use the STAR method: Situation (describe the project context), Task (your responsibilities), Action (specific steps you took), Result (outcomes and learnings). Focus on problem-solving skills and collaboration."
  }
]

Return only valid JSON array.`

    // Generate questions with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach with deep knowledge of technical interviews, behavioral assessments, and industry-specific hiring practices. Generate highly relevant, challenging, and insightful interview questions that help assess both technical skills and cultural fit. Always respond with valid JSON array format. Focus on questions that reveal problem-solving abilities, technical expertise, leadership potential, and alignment with company values."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0].message.content
    
    // Parse JSON response
    let questions
    try {
      questions = JSON.parse(response)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse OpenAI response as JSON')
      }
    }

    // Ensure questions is an array
    const questionsArray = Array.isArray(questions) ? questions : [questions]

    // If userId is provided, save the session to Supabase
    if (userId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      )

      // Save practice session
      const { error: sessionError } = await supabaseClient
        .from('practice_sessions')
        .insert({
          user_id: userId,
          resume_text: resumeText || null,
          job_description_text: jobDescription || null,
          question_count: questionCount,
          question_types: questionTypes,
          difficulty,
          questions: questionsArray,
          status: 'active'
        })

      if (sessionError) {
        console.error('Error saving session:', sessionError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: questionsArray,
        generatedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating questions:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate questions' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 