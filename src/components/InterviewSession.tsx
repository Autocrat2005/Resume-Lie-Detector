'use client';

import { useState } from 'react';
import { InterviewQuestion, AnswerEvaluation, AIProvider } from '../../lib/types';
import QuestionCard from './QuestionCard';

interface InterviewSessionProps {
  questions: InterviewQuestion[];
  provider: AIProvider;
  onComplete: (results: AnswerResult[]) => void;
}

export interface AnswerResult {
  question: InterviewQuestion;
  answer: string;
  passed: boolean;
  feedback: string;
  confidence: string;
}

export default function InterviewSession({ questions, provider, onComplete }: InterviewSessionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);

  const handleAnswered = (evaluation: AnswerEvaluation & { answer: string }) => {
    const newResult: AnswerResult = {
      question: questions[currentIdx],
      answer: evaluation.answer,
      passed: evaluation.passed,
      feedback: evaluation.feedback,
      confidence: evaluation.confidence,
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(updatedResults);
    }
  };

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-zinc-400">
            <span className="font-bold text-green-400">{passedCount}</span> passed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm text-zinc-400">
            <span className="font-bold text-red-400">{failedCount}</span> caught
          </span>
        </div>
      </div>

      <QuestionCard
        key={questions[currentIdx].id}
        question={questions[currentIdx]}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        provider={provider}
        onAnswered={handleAnswered}
      />
    </div>
  );
}
