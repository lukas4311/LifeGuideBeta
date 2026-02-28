// supabase/progress.ts
import { supabase } from '@/lib/supabase';

export const progressService = {
  // Načti progress pro konkrétní modul
  getModuleProgress: async (moduleId: number) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('module_id', moduleId)
      .order('lesson_key');

    if (error) throw error;
    
    console.log(`📊 Progress pro modul ${moduleId}:`, data); // Debug
    return data || [];
  },

  getAllUserProgress: async () => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .order('module_id, lesson_key');
    
    if (error) throw error;
    return data || [];
  },

  // Ulož/aktualizuj progress pro lesson
  saveLessonProgress: async (params: {
    moduleId: number;
    lessonId: string;      // 'l1'
    reflection_text?: string;
    energy_rating?: number;
    completed?: boolean;
  }) => {
    const { data: existing, error: findError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('module_id', params.moduleId)
      .eq('lesson_key', params.lessonId)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
      throw findError;
    }

    if (existing) {
      // UPDATE
      const { data: updated, error } = await supabase
        .from('user_progress')
        .update({
          reflection_text: params.reflection_text,
          energy_rating: params.energy_rating,
          completed: params.completed ?? false,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      // CREATE
      const userResponse = await supabase.auth.getUser();

      const { data: newRecord, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userResponse.data.user?.id, // aktuální uživatel
          module_id: params.moduleId,
          lesson_key: params.lessonId,
          reflection_text: params.reflection_text,
          energy_rating: params.energy_rating,
          completed: params.completed ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return newRecord;
    }
  },
};
