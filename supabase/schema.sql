-- Resume Lie Detector Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  verdict TEXT NOT NULL,
  results_json JSONB NOT NULL DEFAULT '{}',
  ai_provider TEXT NOT NULL DEFAULT 'groq' CHECK (ai_provider IN ('groq', 'claude')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  skill TEXT NOT NULL,
  answer TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Subscriptions table (Cashfree payments)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  cashfree_order_id TEXT,
  cashfree_payment_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'INR',
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Payment history table
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  cashfree_order_id TEXT NOT NULL,
  cashfree_payment_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON public.answers(session_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_order_id ON public.payment_history(cashfree_order_id);

-- Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for answers
CREATE POLICY "Users can view answers for their sessions"
  ON public.answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = answers.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers for their sessions"
  ON public.answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = answers.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for payment history
CREATE POLICY "Users can view their own payments"
  ON public.payment_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payment_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.payment_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role policies (for API routes)
CREATE POLICY "Service role full access sessions"
  ON public.sessions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access answers"
  ON public.answers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access payment_history"
  ON public.payment_history FOR ALL
  USING (auth.role() = 'service_role');

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
