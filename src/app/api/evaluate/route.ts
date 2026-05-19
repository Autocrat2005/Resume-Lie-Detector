import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '../../../../lib/ai-client';
import { AIProvider } from '../../../../lib/types';

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
    const { question, answer, skill, provider = 'groq' } = body as {
      question: string;
      answer: string;
      skill: string;
      provider?: AIProvider;
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

    const response = await callAI(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Skill being tested: ${skill}\n\nQuestion: ${question}\n\nCandidate's answer: ${answer}`,
        },
      ],
      provider
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
