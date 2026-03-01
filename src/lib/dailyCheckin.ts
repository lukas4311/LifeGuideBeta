// lib/dailyCheckin.ts – kompletní fix
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export const dailyCheckinService = {
  getHistory: async (days: number = 30) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return [];

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('energy_checkins')
      .select('*')
      .eq('user_id', user.id)
      .lte('date', todayStr)
      .order('date', { ascending: false })
      .limit(days);

    if (error) throw error;
    return data || [];
  },

  getToday: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return null;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('energy_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayStr)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // 116 = not found
    return data || null;
  },

  // ✅ FIX: Explicit user_id + upsert
  upsertToday: async (params: { energy_level: number; mood: string; note: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('Not authenticated');

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('energy_checkins')
      .upsert({
        user_id: user.id,        // ✅ Explicitně
        date: todayStr,
        energy_level: params.energy_level,
        mood: params.mood,
        note: params.note || null,
      }, { 
        onConflict: 'user_id,date' 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
