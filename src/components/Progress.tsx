import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { getModulesFromSupabase } from '../components/ModulesDataLegacy';
import { Trophy, Flame, CheckCircle2, Zap, Star } from 'lucide-react';
import { progressDashboardService, type DashboardStats } from '@/lib/progressDashboard';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns'; 

export default function Progress() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [dashboardStats, modProgress, fetchedModules] = await Promise.all([
          progressDashboardService.getDashboardStats(),
          progressDashboardService.getModuleProgress(),
          getModulesFromSupabase(t),
        ]);

        setStats(dashboardStats || null);
        setModuleProgress(modProgress);
        setModules(fetchedModules);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalLessons = 25; // 5 modules × 5 lessons
  const completedLessons = stats?.completedLessons || 0;
  const overallPct = Math.round((completedLessons / totalLessons) * 100);

  const statsData = [
    {
      label: t('modulesCompleted'),
      value: `${stats?.completedModules || 0}/5`,
      icon: Trophy,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      label: t('lessonsCompleted'),
      value: `${completedLessons}/${totalLessons}`,
      icon: CheckCircle2,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      label: t('currentStreak'),
      value: `${stats?.streak || 0} ${t('days')}`,
      icon: Flame,
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50'
    },
    {
      label: t('energyLevel'),
      value: (stats?.avgEnergy || 0).toString(),
      icon: Zap,
      color: 'from-violet-400 to-purple-500',
      bgColor: 'bg-violet-50'
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('yourJourney')}
          </h1>
          <p className="text-gray-500">{t('overallProgress')}</p>
        </motion.div>

        {/* Overall progress ring */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex justify-center mb-12">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${overallPct * 3.27} 327`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-gray-900">{overallPct}%</span>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center ${stat.bgColor}`}
              >
                <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Module progress */}
        <div className="space-y-4 mb-12">
          {modules.map((mod: any, index: number) => {
            const Icon = mod.icon;
            const modData = moduleProgress.find((p: any) => p.module_id === mod.id);
            const modCompleted = modData?.completed_lessons || 0;
            const totalLessons = modData?.total_lessons || 5;
            const pct = Math.round((modCompleted / totalLessons) * 100);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${mod.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">{t('module')} {mod.id}</span>
                        <h3 className="font-bold text-gray-900">{t(mod.titleKey)}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {pct === 100 && <Star className="w-4 h-4 text-amber-400" />}
                        <span className={`text-sm font-bold ${mod.textColor}`}>{modCompleted}/{totalLessons}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${mod.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Energy history */}
        {stats?.recentCheckins?.length > 0 && (
          <motion.div /* ... */>
            {stats?.checkInsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-12"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-500" />
                  {t('energyTrend')}
                </h3>

                {/* ✅ Energy history chart */}
                <div className="flex gap-2 items-end h-40 px-2">
                  {stats.recentCheckins.slice(0, 21).reverse().map((checkIn: any, idx: number) => {
                    const height = (checkIn.energy_level / 10) * 100;
                    return (
                      <div key={checkIn.id || idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-900">
                          {checkIn.energy_level}
                        </span>
                        <div
                          className="w-full rounded-xl transition-all duration-500 cursor-pointer hover:shadow-md hover:scale-[1.05]"
                          style={{
                            height: `${height}%`,
                            background: `linear-gradient(to top, 
                  hsl(${40 + checkIn.energy_level * 12}, 80%, 50%), 
                  hsl(${40 + checkIn.energy_level * 12}, 80%, 65%)
                )`,
                            minHeight: '4px',
                          }}
                          title={`${format(new Date(checkIn.date), 'MMM d')} - ${checkIn.energy_level}/10`}
                        />
                        <span className="text-[9px] text-gray-300">
                          {format(new Date(checkIn.date), 'dd')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Trend summary */}
                {/* <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 rounded-xl bg-violet-50">
                    <div className="font-bold text-xl text-violet-700">{stats.checkInsCount}</div>
                    <div className="text-violet-600">check-ins</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-50">
                    <div className="font-bold text-xl text-emerald-700">
                      {stats.avgEnergy.toFixed(1)}
                    </div>
                    <div className="text-emerald-600">průměr</div>
                  </div>
                </div> */}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
