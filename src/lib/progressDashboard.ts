import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';  // ✅ Pro datumové výpočty

export type ModuleProgress = {
    module_id: number;
    completed_lessons: number;
    total_lessons: number;
    progress_pct: number;
};

export type DashboardStats = {
    totalLessons: number;
    completedLessons: number;
    completedModules: number;
    avgEnergy: number;
    streak: number;
    checkInsCount: number;
    recentCheckins: any[];
};

export const progressDashboardService = {
    getDashboardStats: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return null;

        const [lessonsProgress, checkins] = await Promise.all([
            supabase.from('module_progress').select('*').eq('user_id', user.id),
            supabase
                .from('energy_checkins')
                .select('energy_level, date, created_at')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(365),
        ]);

        const lessonsData = lessonsProgress.data || [];
        if (!lessonsData.length) return null;

        const totalLessons = lessonsData.reduce((sum, m: any) => sum + m.total_lessons, 0);
        const completedLessons = lessonsData.reduce((sum, m: any) => sum + m.completed_lessons, 0);
        const completedModules = lessonsData.filter((m: any) => m.progress_pct >= 100).length;

        const checkinsData = checkins.data || [];
        const avgEnergy = checkinsData.length
            ? checkinsData.reduce((sum, c: any) => sum + c.energy_level, 0) / checkinsData.length
            : 0;

        const streak = progressDashboardService.calculateStreak(checkinsData);

        return {
            totalLessons,
            completedLessons,
            completedModules,
            avgEnergy: Math.round(avgEnergy * 10) / 10,
            streak,
            checkInsCount: checkinsData.length,
            recentCheckins: checkinsData.slice(0, 21), // posledních 21 dní pro graf
        } as DashboardStats;
    },

    getModuleProgress: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return [];

        const { data } = await supabase
            .from('module_progress')
            .select('*')
            .eq('user_id', user.id)
            .order('module_id');

        return data as ModuleProgress[];
    },

    // Streak calculation
    calculateStreak(checkins: any[]) {
        if (!checkins.length) return 0;

        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const checkDateStr = format(new Date(today.getTime() - i * 86400000), 'yyyy-MM-dd');
            const hasCheckIn = checkins.some((c: any) => c.date === checkDateStr);

            if (hasCheckIn) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        return streak;
    }
};
