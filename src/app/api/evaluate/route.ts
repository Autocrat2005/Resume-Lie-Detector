import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '../../../../lib/ai-client';
import { AIProvider } from '../../../../lib/types';
import { createServerSupabaseClient } from '../../../../lib/supabase-server';

const SYSTEM_PROMPT = `You are evaluating an interview answer. You were given a specific technical question and the candidate's response.

Determine if the candidate actually knows what they're talking about or if they're bluffing.

Respond with valid JSON:
{
  "passed": true/false,
  "feedback": "<2-3 sentence evaluation. Be direct and specific about what they got right or wrong.>",
  "confidence": "low" | "medium" | "high"
}

Criteria:
- passed=true: They demonstrated genuine understanding, even if imperfect
- passed=false: They gave vague/incorrect/memorized answers without real understanding
- Be fair but firm. Buzzword salad = fail. Honest partial knowledge = pass with feedback.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, skill } = body as {
      question: string;
      answer: string;
      skill: string;
    };

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    if (answer.trim().length < 10) {
      return NextResponse.json(
        { error: 'Answer must be at least 10 characters' },
        { status: 400 }
      );
    }

    // 1. Fetch user subscription to determine their tier and model
    const supabase = await createServerSupabaseClient();
    let plan = 'free';

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user is in the Pro whitelist
        const proEmailsStr = process.env.NEXT_PUBLIC_PRO_EMAILS || '';
        const proEmails = proEmailsStr.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
        if (user.email && proEmails.includes(user.email.toLowerCase())) {
          plan = 'pro';
        } else {
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
    }

    // Free users always use GROQ API (Llama 3.3). Pro users always use Claude Sonnet.
    const chosenProvider: AIProvider = plan === 'pro' ? 'claude' : 'groq';

    const response = await callAI(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Skill being tested: ${skill}\n\nQuestion: ${question}\n\nCandidate's answer: ${answer}`,
        },
      ],
      chosenProvider
    );

    let parsed;
    try {
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

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Evaluation error:', error);
    const message = error instanceof Error ? error.message : 'Evaluation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
