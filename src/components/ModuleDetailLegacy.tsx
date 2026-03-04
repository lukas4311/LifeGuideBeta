import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { getModulesFromSupabase } from './ModulesDataLegacy';
import LessonContentLegacy from './LessonContentLegacy';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl, getSourceTexts } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { progressService } from '@/lib/progress';
import { supabase } from '@/lib/supabase';

export type ModuleSource = {
  id: number;
  module_id: number;
  source_type: 'book' | 'video' | 'article' | 'podcast' | 'other';
  url: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  order_index: number;
  translations: {
    [lang: string]: {
      title: string;
      description: string;
    };
  };
};

export default function ModuleDetailLegacy() {
  const { t, lang } = useLanguage();
  const [modules, setModules] = useState<any[]>([]);
  const [module, setModule] = useState<any | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState<any[]>([]);
  const [sources, setSources] = useState<ModuleSource[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = parseInt(urlParams.get('module') || '1', 10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedModules, progressData, moduleSources] = await Promise.all([
        getModulesFromSupabase(t),
        progressService.getModuleProgress(moduleId),
        supabase
          .from('module_sources')
          .select('*')
          .eq('module_id', moduleId)
          .order('order_index', { ascending: true }),
      ]);

      setModules(fetchedModules);
      setProgress(progressData);

      if (moduleSources.error) {
        console.error('Error loading module sources:', moduleSources.error);
        setSources([]);
      } else {
        setSources(moduleSources.data || []);
      }

      const foundModule = fetchedModules.find((m: any) => m.id === moduleId);
      if (foundModule) {
        setModule(foundModule);
        setCurrentLessonIndex(0);
      } else {
        setModule(null);
      }
    } catch (error) {
      console.error('Chyba:', error);
      setModule(null);
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

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
    ? progress.find((p: any) => p.lesson_key === currentLesson.id)
    : null;

  const handleSaveProgress = async (data: any) => {
    if (!currentLesson) return;

    try {
      const saved = await progressService.saveLessonProgress({
        moduleId,
        lessonId: currentLesson.id,
        reflection_text: data.reflection_text,
        energy_rating: data.energy_rating,
        completed: data.completed,
      });

      setProgress(prev =>
        prev.find((p: any) => p.lesson_key === currentLesson.id)
          ? prev.map((p: any) =>
              p.lesson_key === currentLesson.id ? { ...saved } : p
            )
          : [...prev, saved]
      );
    } catch (error) {
      console.error('Chyba ukládání progressu:', error);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

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
          <div
            className={`absolute inset-0 bg-gradient-to-t ${module.color} opacity-70`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    {t('module')} {module.id} (Legacy)
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {t(module.titleKey)}
                  </h1>
                </div>
              </div>
              <p className="text-white/80 text-sm md:text-base max-w-xl">
                {t(module.subtitleKey)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Lesson sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                {t('lessons')}
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {module.lessons.map((lesson: any, index: number) => {
                  const lessonProgress = progress.find(
                    (p: any) => p.lesson_id === lesson.id
                  );
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
                        <Circle
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? module.textColor : 'text-gray-300'
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {t(lesson.titleKey)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 hidden lg:block">
                <Link to={createPageUrl('ModulesLegacy')}>
                  <Button
                    variant="ghost"
                    className="w-full rounded-xl text-gray-500"
                  >
                    ← {t('modules')} (Legacy)
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Lesson + sources column */}
          <div className="flex-1 space-y-8">
            {/* Lesson content */}
            {currentLesson ? (
              <LessonContentLegacy
                key={currentLesson.id}
                lesson={currentLesson}
                moduleColor={module.color}
                moduleTextColor={module.textColor}
                moduleAccent={module.accentColor}
                progressData={currentProgress}
                onSaveProgress={handleSaveProgress}
                onNext={() =>
                  setCurrentLessonIndex(
                    Math.min(currentLessonIndex + 1, module.lessons.length - 1)
                  )
                }
                onPrevious={() =>
                  setCurrentLessonIndex(Math.max(currentLessonIndex - 1, 0))
                }
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

            {/* Extra sources section */}
            {/* Extra resources section */}
            {sources.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-gray-500" />
                  {t('extraResources') || 'Další zdroje'}
                </h3>

                <div className="space-y-4">
                  {sources.map((src: ModuleSource) => {
                    const { title, description } = getSourceTexts(src, lang);
                    const hasImage = src.image_url || src.thumbnail_url;

                    return (
                      <div
                        key={src.id}
                        className="p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-default"
                      >
                        <div
                          className={`flex ${
                            hasImage ? 'items-start' : 'items-center'
                          } gap-3 group`}
                        >
                          {/* Left: text + miniatura */}
                          <div className="flex-1">
                            {hasImage && (
                              <div
                                className="mb-2 w-16 h-16 rounded-xl overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0 group-hover:shadow-md group-hover:scale-[1.05] transition-all"
                                onClick={() =>
                                  openImageModal(
                                    src.image_url || src.thumbnail_url || ''
                                  )
                                }
                              >
                                <img
                                  src={src.thumbnail_url || src.image_url}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <h4 className="font-semibold text-gray-900 mb-1">
                              {src.url ? (
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-violet-700 hover:underline transition-colors"
                                >
                                  {title}
                                </a>
                              ) : (
                                title
                              )}
                            </h4>

                            {description && (
                              <p className="text-sm text-gray-600">
                                {description}
                              </p>
                            )}
                          </div>

                          {/* Right: tag + externí odkaz */}
                          <div className="flex-shrink-0 flex flex-col gap-1 items-end">
                            {src.source_type === 'book' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                {t('book') || 'Kniha'}
                              </span>
                            )}
                            {src.source_type === 'video' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                                {t('video') || 'Video'}
                              </span>
                            )}
                            {src.source_type === 'article' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {t('article') || 'Článek'}
                              </span>
                            )}
                            {src.source_type === 'podcast' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                                {t('podcast') || 'Podcast'}
                              </span>
                            )}
                            {src.source_type === 'other' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                                {t('resource') || 'Zdroj'}
                              </span>
                            )}

                            {/* {src.url && (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-xs transition-colors"
                              >
                                {t('open') || 'Otevřít →'}
                              </a>
                            )} */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Modal pro zvětšený obrázek */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-4xl max-h-[90vh] w-full h-full relative"
          >
            <img
              src={selectedImage}
              alt="Zvětšený obrázek"
              className="w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg backdrop-blur-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
