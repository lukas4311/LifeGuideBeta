import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import { getModulesLegacy } from './ModulesDataLegacy';
import LessonContentLegacy from './LessonContentLegacy';
import { CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { Button } from "@/components/ui/button";

export default function ModuleDetailLegacy() {
  const { t } = useLanguage();
  const modules = getModulesLegacy(t);
  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = parseInt(urlParams.get('module') || '1');
  const module = modules.find(m => m.id === moduleId);
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      const data = []; //await base44.entities.UserProgress.filter({ module_id: moduleId });
      setProgress(data);
      setLoading(false);
    };
    loadProgress();
  }, [moduleId]);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Module not found</p>
      </div>
    );
  }

  const Icon = module.icon;
  const currentLesson = module.lessons[currentLessonIndex];
  const currentProgress = currentLesson ? progress.find(p => p.lesson_id === currentLesson.id) : null;

  const handleSaveProgress = async (data) => {
    if (!currentLesson) return;
    
    const existing = progress.find(p => p.lesson_id === currentLesson.id);
    // if (existing) {
    //   await base44.entities.UserProgress.update(existing.id, data);
    //   setProgress(prev => prev.map(p => p.id === existing.id ? { ...p, ...data } : p));
    // } else {
    //   const newRecord = await base44.entities.UserProgress.create({
    //     module_id: moduleId,
    //     lesson_id: currentLesson.id,
    //     ...data
    //   });
    //   setProgress(prev => [...prev, newRecord]);
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

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