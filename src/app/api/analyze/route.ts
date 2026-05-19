import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '../../../../lib/ai-client';
import { AIProvider } from '../../../../lib/types';
import { createServerSupabaseClient } from '../../../../lib/supabase-server';

const SYSTEM_PROMPT = `You are an aggressive technical interviewer. Your job is to dissect resumes and expose exaggerations.

Extract ALL skill claims, project claims, and experience claims from the resume. For each claim, generate a targeted interview question that would expose if the person doesn't actually know it.

You MUST respond with valid JSON in this exact format:
{
  "score": <number 0-100, honesty likelihood score>,
  "verdict": "<one brutal sentence summarizing their resume>",
  "skills": [
    {
      "name": "<skill or claim>",
      "confidence": "low" | "medium" | "high",
      "reason": "<why you rated it this way>"
    }
  ],
  "questions": [
    {
      "id": "<unique id like q1, q2, etc>",
      "skill": "<related skill>",
      "question": "<specific aggressive interview question>",
      "severity": "low" | "medium" | "high"
    }
  ]
}

Be ruthless. Look for:
- Vague buzzwords without substance
- Inflated titles or responsibilities
- Technology claims that don't match experience level
- Projects that sound too good to be true
- Gaps in knowledge that the resume tries to hide

Generate at least 8-12 questions covering different claims.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume_text } = body as {
      resume_text: string;
    };

    if (!resume_text || resume_text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (resume_text.length > 15000) {
      return NextResponse.json(
        { error: 'Resume text must be under 15,000 characters' },
        { status: 400 }
      );
    }

    // 1. Fetch user subscription to determine their tier and model
    const supabase = await createServerSupabaseClient();
    let user = null;
    let plan = 'free';

    if (supabase) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;

      if (user) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscription) {
          plan = subscription.plan;
        }
      }
    }

    // Free users always use GROQ API (Llama 3.3). Pro users always use Claude Sonnet.
    const chosenProvider: AIProvider = plan === 'pro' ? 'claude' : 'groq';

    // 2. Enforce the limit of 1 resume per day for Free and Pro tiers
    if (user && supabase) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString());

      if (countError) {
        console.error('Failed to check daily limits:', countError);
      } else if (count !== null && count >= 1) {
        return NextResponse.json(
          {
            error: `Daily limit reached. The ${plan === 'pro' ? 'Pro' : 'Free'} plan is limited to 1 resume analysis per day. Please check back tomorrow!`,
          },
          { status: 429 }
        );
      }
    }

    const response = await callAI(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this resume and generate interview questions:\n\n${resume_text}`,
        },
      ],
      chosenProvider
    );

    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(response.content);
      }
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate and ensure IDs exist on questions
    if (parsed.questions) {
      parsed.questions = parsed.questions.map(
        (q: { id?: string; skill: string; question: string; severity: string }, i: number) => ({
          ...q,
          id: q.id || `q${i + 1}`,
        })
      );
    }

    return NextResponse.json({
      ...parsed,
      provider: response.provider,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
