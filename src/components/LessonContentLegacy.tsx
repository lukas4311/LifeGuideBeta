import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, Lightbulb, PenLine,
  ChevronLeft, ChevronRight, Sparkles, BookOpen
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { toast } from 'sonner';
import ModuleExperience from './ModuleExperience';

export default function LessonContentLegacy({
  lesson,
  moduleColor,
  moduleTextColor,
  moduleAccent,
  moduleId,
  progressData,
  onSaveProgress,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  lessonIndex,
  totalLessons,
}) {
  const { t } = useLanguage();
  const [reflection, setReflection] = useState(progressData?.reflection_text || '');
  const [energyRating, setEnergyRating] = useState(progressData?.energy_rating || 5);
  const [saving, setSaving] = useState(false);

  const isCompleted = progressData?.completed;

  const handleSave = async (markComplete = false) => {
    setSaving(true);
    await onSaveProgress({
      reflection_text: reflection,
      energy_rating: energyRating,
      completed: markComplete ? true : (progressData?.completed || false),
    });
    setSaving(false);
    toast.success(markComplete ? '✨ ' + t('completed') + '!' : t('saved'));
  };

  const handleExerciseComplete = async () => {
    // po dokončení cvičení můžeš např. jen uložit completed
    await handleSave(true);
    toast.success('✨ ' + t('completed') + '!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      {/* Lesson header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Badge
            className={`${moduleColor.replace('from-', 'bg-').split(' ')[0]} text-white border-0 px-3 py-1`}
          >
            {lessonIndex + 1}/{totalLessons}
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('completed')}
            </Badge>
          )}
        </div>
      </div>

      {/* Lesson title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
        {t(lesson.titleKey)}
      </h2>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-10">
        <p className="text-gray-600 leading-relaxed text-lg">
          {t(lesson.contentKey)}
        </p>
      </div>

      {/* Exercise card + vložené kroky cvičení */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 md:p-8 mb-10"
      >
        {/* <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              {t('exercise')}
            </h3>
            <p className="text-amber-800 leading-relaxed mb-4">
              {t(lesson.exerciseKey)}
            </p>
          </div>
        </div> */}

        {/* Volitelné malé tlačítko jen jako vizuální start */}
        {/* <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span className="text-sm text-amber-800">
            {t('startExercise') || 'Začni vyplňovat cvičení níže'}
          </span>
        </div> */}

        {/* Tady je přímo celé cvičení jako součást stránky */}
        <ModuleExperience
          exercise_key={`m${moduleId}L${lesson.id.replace('l', '')}Exercise`}
          onComplete={handleExerciseComplete}
        />
      </motion.div>

      {/* Reflection area */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <PenLine className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">{t('reflection')}</h3>
        </div>
        <Textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder={t('reflectionPlaceholder')}
          className="min-h-[150px] border-gray-200 focus:border-violet-300 rounded-xl text-base resize-none"
        />

        {/* Energy rating */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{t('energyLevel')}</span>
            <span className="text-2xl font-bold" style={{ color: moduleAccent }}>
              {energyRating}/10
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => setEnergyRating(n)}
                className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  n <= energyRating
                    ? 'text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                style={n <= energyRating ? {
                  background: `linear-gradient(135deg, ${moduleAccent}, ${moduleAccent}dd)`
                } : {}}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={() => handleSave(false)}
            variant="outline"
            className="rounded-xl"
            disabled={saving}
          >
            {t('save')}
          </Button>
          {!isCompleted && (
            <Button
              onClick={() => handleSave(true)}
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              disabled={saving}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('complete')}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 pb-12">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={isFirst}
          className="rounded-xl text-gray-500"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('previous')}
        </Button>
        <Button
          variant="ghost"
          onClick={onNext}
          disabled={isLast}
          className="rounded-xl text-gray-500"
        >
          {t('next')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
