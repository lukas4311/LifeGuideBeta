import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export type DailyQuestion = {
  id: number;
  question_key: string;
  translations: {
    [lang: string]: {
      title: string;
      placeholder?: string;
    };
  };
  order_index: number;
};

export type ReflectionAnswer = {
  id: number;
  user_id: string;
  question_id: number;
  date: string; // YYYY-MM-DD
  answer_text: string | null;
  answer_number: number | null;
  created_at: string;
  updated_at: string;
};

export type QuestionKey = 'grateful' | 'happiest' | 'made_happy' | 'enjoyed' | 'energy' | 'happiness';

export const dailyReflectionService = {
  async getQuestions(): Promise<DailyQuestion[]> {
    const { data, error } = await supabase
      .from('daily_questions')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getTodayAnswers(): Promise<ReflectionAnswer[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return [];

    const date = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('daily_reflection_answers')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('question_id');

    if (error) throw error;
    return data || [];
  },

  // ukládá/aktualizuje jednu odpověď na otázku (per question)
  async upsertAnswer(
    question: DailyQuestion,
    payload: { answer_text?: string; answer_number?: number }
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('Not authenticated');

    const date = format(new Date(), 'yyyy-MM-dd');

    const { error } = await supabase
      .from('daily_reflection_answers')
      .upsert(
        {
          user_id: user.id,
          question_id: question.id,
          date,
          answer_text: payload.answer_text ?? null,
          answer_number: payload.answer_number ?? null,
        },
        { onConflict: 'user_id,question_id,date' }
      );

    if (error) throw error;
  },
};
