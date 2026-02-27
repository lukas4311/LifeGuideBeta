import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
// import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import { getModulesLegacy, getModulesFromSupabase } from './ModulesDataLegacy';
import LessonContentLegacy from './LessonContentLegacy';
import { CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { Button } from "@/components/ui/button";

export default function ModuleDetailLegacy() {
  const { t } = useLanguage();
  const [modules, setModules] = useState([]);
  const [module, setModule] = useState(null); // null místo undefined
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = parseInt(urlParams.get('module') || '1');

  // 🔧 FIX: Funkce pro načtení všech dat
  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      // 1. Načti moduly
      const fetchedModules = await getModulesFromSupabase(t);
      setModules(fetchedModules);

      // 2. Hned najdi modul z načtených dat (ne ze stavu!)
      const foundModule = fetchedModules.find((m: any) => m.id === moduleId);
      
      if (foundModule) {
        setModule(foundModule);
        // Reset lesson index na 0 pro nový modul
        setCurrentLessonIndex(0);
      } else {
        console.warn(`Modul ${moduleId} nenalezen`);
        setModule(null);
      }

      // 3. Načti progress (pokud budeš mít Supabase progress)
      // const progressData = await supabase.from('lesson_answers').select('*').eq('module_id', moduleId);
      // setProgress(progressData.data || []);
      
    } catch (error) {
      console.error('Chyba načítání dat:', error);
      setModule(null);
    } finally {
      setLoading(false);
    }
  }, [moduleId, t]);

  // 🔧 FIX: Spusť načítání při změně moduleId
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔧 FIX: Loading state pokrývá i "module not found"
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  // 🔧 FIX: Jednodušší check
  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900 mb-2">Modul nenalezen</p>
          <p className="text-gray-500 mb-6">Modul {moduleId} neexistuje.</p>
          <Link to={createPageUrl('ModulesLegacy')}>
            <Button>Zpět na moduly</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = module.icon;
  const currentLesson = module.lessons[currentLessonIndex];
  const currentProgress = currentLesson 
    ? progress.find((p: any) => p.lesson_id === currentLesson.id) 
    : null;

  const handleSaveProgress = async (data: any) => {
    if (!currentLesson) return;
    
    // Placeholder pro Supabase save (přidej později)
    console.log('Ukládám progress:', { moduleId, lessonId: currentLesson.id, data });
  };

  // ... zbytek komponenty zůstává STEJNÝ (header, sidebar, LessonContentLegacy)
  return (
    <div className="min-h-screen">
      {/* Module header */}
      <div className="relative overflow-hidden">
        <div className="relative h-64 md:h-72">
          <img 
            src={module.image} 
            alt={t(module.titleKey)}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${module.color} opacity-70`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">{t('module')} {module.id} (Legacy)</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{t(module.titleKey)}</h1>
                </div>
              </div>
              <p className="text-white/80 text-sm md:text-base max-w-xl">{t(module.subtitleKey)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Lesson sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{t('lessons')}</h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {module.lessons.map((lesson, index) => {
                  const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
                  const isActive = index === currentLessonIndex;
                  const isDone = lessonProgress?.completed;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 whitespace-nowrap lg:whitespace-normal min-w-fit ${
                        isActive
                          ? `bg-white shadow-md border ${module.borderColor}`
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className={`w-5 h-5 flex-shrink-0 ${isActive ? module.textColor : 'text-gray-300'}`} />
                      )}
                      <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {t(lesson.titleKey)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 hidden lg:block">
                <Link to={createPageUrl('ModulesLegacy')}>
                  <Button variant="ghost" className="w-full rounded-xl text-gray-500">
                    ← {t('modules')} (Legacy)
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Lesson content */}
          <div className="flex-1">
            {currentLesson ? (
              <LessonContentLegacy
                key={currentLesson.id}
                lesson={currentLesson}
                moduleColor={module.color}
                moduleTextColor={module.textColor}
                moduleAccent={module.accentColor}
                progressData={currentProgress}
                onSaveProgress={handleSaveProgress}
                onNext={() => setCurrentLessonIndex(Math.min(currentLessonIndex + 1, module.lessons.length - 1))}
                onPrevious={() => setCurrentLessonIndex(Math.max(currentLessonIndex - 1, 0))}
                isFirst={currentLessonIndex === 0}
                isLast={currentLessonIndex === module.lessons.length - 1}
                lessonIndex={currentLessonIndex}
                totalLessons={module.lessons.length}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Tento modul nemá žádné lekce.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}