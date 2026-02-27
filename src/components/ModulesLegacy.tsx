import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import { getModulesFromSupabase, getModulesLegacy } from './ModulesDataLegacy';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { get } from 'http';

export default function ModulesLegacy() {
  const { t } = useLanguage();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      const data = [] //await base44.entities.UserProgress.list();
      setProgress(data);
      setLoading(false);
      const fetchedModules = await getModulesFromSupabase(t); // načti moduly z DB až po načtení progressu
      setModules(fetchedModules);
    };
    loadProgress();
  }, []);

  const getModuleProgress = (moduleId) => {
    const moduleProgress = progress.filter(p => p.module_id === moduleId);
    const completedCount = moduleProgress.filter(p => p.completed).length;
    const module = modules.find(m => m.id === moduleId);
    return module ? Math.round((completedCount / module.lessons.length) * 100) : 0;
  };

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 1) return true;
    
    const previousModule = modules.find(m => m.id === moduleId - 1);
    if (!previousModule) return false;
    
    const previousProgress = progress.filter(p => p.module_id === moduleId - 1);
    const allCompleted = previousProgress.length >= previousModule.lessons.length &&
                        previousProgress.every(p => p.completed);
    
    return allCompleted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-6">
            <span>📚</span>
            <span>Legacy Version</span>
          </div> */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('modulesTitle')}
          </h1>
          <p className="text-xl text-gray-600  max-w-3xl mx-auto">
            {t('moduleSubtitle')}
          </p>
        </motion.div>

        {/* Module timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent transform -translate-x-1/2" />

          {/* Modules */}
          <div className="space-y-16">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const isUnlocked = isModuleUnlocked(module.id);
              const progressPercent = getModuleProgress(module.id);
              const isCompleted = progressPercent === 100;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 items-center`}
                >
                  {/* Module card */}
                  <div className="w-full md:w-5/12">
                    <div className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                      isUnlocked 
                        ? `${module.borderColor} bg-white hover:shadow-xl cursor-pointer`
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      {/* Image header */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={module.image} 
                          alt={t(module.titleKey)}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            isUnlocked ? 'group-hover:scale-110' : 'opacity-40'
                          }`}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${module.color} ${
                          isUnlocked ? 'opacity-60' : 'opacity-30'
                        }`} />
                        <div className={`absolute top-4 right-4 w-12 h-12 rounded-2xl ${module.bgColor} flex items-center justify-center shadow-lg`}>
                          <Icon className={`w-6 h-6 ${module.textColor}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${module.textColor}`}>
                              {t('module')} {module.id}
                            </p>
                            <h3 className={`text-2xl font-bold mb-2 ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                              {t(module.titleKey)}
                            </h3>
                            <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {t(module.subtitleKey)}
                            </p>
                          </div>
                          {!isUnlocked && (
                            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          {isCompleted && (
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                          )}
                        </div>

                        <p className={`text-sm leading-relaxed mb-4 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {t(module.descriptionKey)}
                        </p>

                        {/* Progress bar */}
                        {isUnlocked && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-500">{t('progress')}</span>
                              <span className="text-xs font-bold text-gray-700">{progressPercent}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${module.color}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progressPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action button */}
                        {isUnlocked ? (
                          <Link to={createPageUrl('ModuleDetailLegacy') + `?module=${module.id}`}>
                            <Button 
                              className={`w-full rounded-xl bg-gradient-to-r ${module.color} text-white hover:shadow-lg transition-all`}
                            >
                              {progressPercent > 0 ? t('continueModule') : t('startModule')}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        ) : (
                          <div className="text-center py-3 px-4 rounded-xl bg-gray-100 text-gray-400 text-sm">
                            {t('locked')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline node */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      isCompleted ? 'bg-green-500' : 
                      isUnlocked ? module.bgColor : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      ) : (
                        <span className={`text-2xl font-bold ${
                          isUnlocked ? module.textColor : 'text-gray-400'
                        }`}>
                          {module.id}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}