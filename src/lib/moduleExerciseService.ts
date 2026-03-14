// lib/moduleExerciseService.ts

import { supabase } from '@/lib/supabase';

export type ExerciseStep = {
  id: number;
  lesson_key: string;
  step_order: number;
  step_key: string;
  step_type: 'intro' | 'textarea' | 'textarea_list' | 'input_list' | 'fields' | 'interactive';
  items_count: number | null;
  translations: {
    [lang: string]: {
      step_label?: string;
      title?: string;
      description?: string;
      quote?: string;
      subtitle?: string;
      button_text?: string;
      exercise_title?: string;
      exercise_intro?: string;
      exercise_prompt?: string;
      reminder?: string;
      completion_message?: string;
      closing_message?: string;
      placeholder?: string;
      field_label?: string;
      reflection_prompt?: string;
      component?: string;                                          // ← název custom komponenty
      fields?: { key: string; label: string; placeholder: string }[];
    };
  };
};

export type ExerciseAnswer = {
  id: number;
  user_id: string;
  step_id: number;
  answer_data: Record<string, any>;
  completed: boolean;
};

export const moduleExerciseService = {
  async getSteps(lessonKey: string): Promise<ExerciseStep[]> {
    const { data, error } = await supabase
      .from('module_exercise_steps')
      .select('*')
      .eq('exercise_key', lessonKey)
      .order('step_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAnswers(lessonKey: string): Promise<ExerciseAnswer[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return [];

    const { data: steps, error: stepsError } = await supabase
      .from('module_exercise_steps')
      .select('id')
      .eq('exercise_key', lessonKey);

    if (stepsError) throw stepsError;
    if (!steps?.length) return [];

    const stepIds = steps.map(s => s.id);

    const { data, error } = await supabase
      .from('module_exercise_answers')
      .select('*')
      .eq('user_id', user.id)
      .in('step_id', stepIds);

    if (error) throw error;
    return data || [];
  },

  async upsertAnswer(
    stepId: number,
    answerData: Record<string, any>,
    completed: boolean
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('module_exercise_answers')
      .upsert(
        {
          user_id: user.id,
          step_id: stepId,
          answer_data: answerData,
          completed,
        },
        { onConflict: 'user_id,step_id' }
      );

    if (error) throw error;
  },
};
