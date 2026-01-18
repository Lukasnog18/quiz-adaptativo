
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create quiz_sessions table
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  initial_level TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  finished_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0 NOT NULL,
  correct_answers INTEGER DEFAULT 0 NOT NULL
);

-- Create quiz_answers table
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz sessions policies
CREATE POLICY "Users can view their own sessions"
  ON public.quiz_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.quiz_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.quiz_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Quiz answers policies (access through session ownership)
CREATE POLICY "Users can view answers from their sessions"
  ON public.quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers to their sessions"
  ON public.quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers(session_id);
