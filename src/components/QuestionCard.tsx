'use client';

import { useState } from 'react';
import { InterviewQuestion, AnswerEvaluation, AIProvider } from '../../lib/types';

interface QuestionCardProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
  provider: AIProvider;
  onAnswered: (evaluation: AnswerEvaluation & { answer: string }) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  provider,
  onAnswered,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AnswerEvaluation | null>(null);

  const severityConfig = {
    low: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };

  const config = severityConfig[question.severity];

  const handleSubmit = async () => {
    if (answer.trim().length < 10) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          answer: answer.trim(),
          skill: question.skill,
          provider,
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');

      const evaluation: AnswerEvaluation = await res.json();
      setResult(evaluation);

      setTimeout(() => {
        onAnswered({ ...evaluation, answer: answer.trim() });
      }, 2500);
    } catch (err) {
      console.error(err);
      const fallback: AnswerEvaluation = {
        passed: false,
        feedback: 'Could not evaluate. Please try again.',
        confidence: 'low',
      };
      setResult(fallback);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 tabular-nums">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      <div className={`rounded-2xl border ${config.border} bg-zinc-900/50 backdrop-blur-xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className={`rounded-full ${config.bg} px-2.5 py-0.5 text-xs font-medium ${config.color} uppercase tracking-wider`}>
              {question.severity}
            </span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">{question.skill}</span>
          </div>
        </div>

        {/* Question */}
        <div className="px-6 py-5">
          <p className="text-base font-medium text-white leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Answer or result */}
        {result ? (
          <div className={`mx-6 mb-6 rounded-xl p-4 border ${
            result.passed
              ? 'bg-green-500/5 border-green-500/20'
              : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.passed ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              )}
              <span className={`text-sm font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.passed ? 'PASSED' : 'CAUGHT'}
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{result.feedback}</p>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer... be specific if you actually know this."
              className="w-full min-h-[120px] resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-white/20 focus:outline-none"
              disabled={isEvaluating}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs ${answer.trim().length < 10 ? 'text-zinc-600' : 'text-zinc-500'}`}>
                {answer.trim().length < 10 ? `${10 - answer.trim().length} more characters needed` : 'Ready to submit'}
              </span>
              <button
                onClick={handleSubmit}
                disabled={answer.trim().length < 10 || isEvaluating}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
