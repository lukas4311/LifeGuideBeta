// components/ModuleExperience.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { moduleExerciseService, type ExerciseStep } from '@/lib/moduleExerciseService';
import InteractiveHand from './InteractiveHand';

interface ModuleExperienceProps {
  exercise_key: string;
  onComplete?: () => void;
}

// ─── Registr custom komponent ─────────────────────────────────────────────────
// Přidej sem libovolnou novou komponentu kdykoli v budoucnu
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  InteractiveHand,
};

export default function ModuleExperience({ exercise_key, onComplete }: ModuleExperienceProps) {
  const { lang } = useLanguage();
  const [steps, setSteps] = useState<ExerciseStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedSteps, fetchedAnswers] = await Promise.all([
        moduleExerciseService.getSteps(exercise_key),
        moduleExerciseService.getAnswers(exercise_key),
      ]);

      setSteps(fetchedSteps);

      // Naplň odpovědi z DB
      const map: Record<number, Record<string, any>> = {};
      for (const ans of fetchedAnswers) {
        map[ans.step_id] = ans.answer_data;
      }
      setAnswers(map);

      // Obnov poslední nedokončený krok
      const lastCompletedIndex = fetchedAnswers
        .filter(a => a.completed)
        .map(a => fetchedSteps.findIndex(s => s.id === a.step_id))
        .filter(idx => idx >= 0)
        .sort((a, b) => b - a)[0];

      if (lastCompletedIndex !== undefined && lastCompletedIndex < fetchedSteps.length - 1) {
        setCurrentStep(lastCompletedIndex + 1);
      }
    } catch (err) {
      console.error('Error loading exercise:', err);
    } finally {
      setLoading(false);
    }
  }, [exercise_key]);

  useEffect(() => {
    load();
  }, [load]);

  const handleNext = async (stepAnswerData: Record<string, any> = {}) => {
    const step = steps[currentStep];
    const merged = { ...(answers[step.id] || {}), ...stepAnswerData };
    const isLast = currentStep === steps.length - 1;

    setAnswers(prev => ({ ...prev, [step.id]: merged }));

    try {
      await moduleExerciseService.upsertAnswer(step.id, merged, isLast);
    } catch (err) {
      console.error('Error saving answer:', err);
    }

    if (isLast) {
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!steps.length) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;
  const savedData = answers[step.id] || {};
  const trans = step.translations[lang] ?? step.translations['cs'] ?? step.translations['en'] ?? {};

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Progress bar */}
      <div className="sticky top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          <StepRenderer
            key={step.id}
            step={step}
            trans={trans}
            savedData={savedData}
            isFirst={isFirst}
            isLast={isLast}
            onNext={handleNext}
            onBack={handleBack}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step renderer ────────────────────────────────────────────────────────────

interface StepRendererProps {
  step: ExerciseStep;
  trans: Record<string, any>;
  savedData: Record<string, any>;
  isFirst: boolean;
  isLast: boolean;
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
}

function StepRenderer({ step, trans, savedData, isFirst, isLast, onNext, onBack }: StepRendererProps) {
  switch (step.step_type) {
    case 'intro':
      return <StepIntro trans={trans} onNext={onNext} />;
    case 'textarea':
      return (
        <StepTextarea
          trans={trans}
          savedData={savedData}
          isLast={isLast}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 'textarea_list':
      return (
        <StepTextareaList
          trans={trans}
          savedData={savedData}
          count={step.items_count ?? 3}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 'input_list':
      return (
        <StepInputList
          trans={trans}
          savedData={savedData}
          count={step.items_count ?? 5}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 'fields':
      return (
        <StepFields
          trans={trans}
          savedData={savedData}
          isLast={isLast}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 'interactive':                                            // ← nový case
      return <StepInteractive trans={trans} onNext={onNext} onBack={onBack} />;
    default:
      return null;
  }
}

// ─── Intro step ───────────────────────────────────────────────────────────────

function StepIntro({ trans, onNext }: { trans: any; onNext: (d?: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="text-center py-20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      {trans.quote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-gray-500 mb-6 italic max-w-2xl mx-auto whitespace-pre-line"
        >
          "{trans.quote}"
        </motion.p>
      )}

      {trans.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          {trans.subtitle}
        </motion.p>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <Button
          onClick={() => onNext()}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-lg px-8 py-6 rounded-2xl"
        >
          {trans.button_text ?? 'Začít'} <ChevronRight className="ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Textarea step (single) ───────────────────────────────────────────────────

function StepTextarea({ trans, savedData, isLast, onNext, onBack }: {
  trans: any;
  savedData: any;
  isLast: boolean;
  onNext: (d?: any) => void;
  onBack: () => void;
}) {
  const [value, setValue] = useState<string>(savedData.text ?? '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        {trans.step_label && (
          <p className="text-sm text-amber-600 font-medium mb-2">{trans.step_label}</p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{trans.title}</h2>
        {trans.description && (
          <p className="text-lg text-gray-600 whitespace-pre-line">{trans.description}</p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 mb-8 border border-amber-200"
      >
        {trans.exercise_intro && (
          <p className="text-center text-lg text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
            <span className="text-2xl">✨</span>
            <br /><br />
            {trans.exercise_intro}
          </p>
        )}
        {trans.exercise_title && (
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            {trans.exercise_title}
          </h3>
        )}
        {trans.exercise_prompt && (
          <p className="text-gray-600 mb-6 text-center">{trans.exercise_prompt}</p>
        )}

        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={trans.placeholder ?? ''}
          className="min-h-[150px] bg-white text-base"
        />

        {trans.reminder && (
          <p className="text-sm text-amber-700 mt-4 text-center italic">{trans.reminder}</p>
        )}
      </motion.div>

      {trans.closing_message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-8 border border-violet-200"
        >
          <p className="text-center text-violet-800 leading-relaxed whitespace-pre-line">
            {trans.closing_message}
          </p>
        </motion.div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={() => onNext({ text: value })}
        disabled={!value.trim()}
        isLast={isLast}
        buttonText={trans.button_text}
      />
    </motion.div>
  );
}

// ─── Textarea list step ───────────────────────────────────────────────────────

function StepTextareaList({ trans, savedData, count, onNext, onBack }: {
  trans: any;
  savedData: any;
  count: number;
  onNext: (d?: any) => void;
  onBack: () => void;
}) {
  const [items, setItems] = useState<string[]>(
    savedData.items ?? Array(count).fill('')
  );

  const isComplete = items.every(b => b.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        {trans.step_label && (
          <p className="text-sm text-amber-600 font-medium mb-2">{trans.step_label}</p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{trans.title}</h2>
        {trans.description && (
          <p className="text-lg text-gray-600 whitespace-pre-line">{trans.description}</p>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100"
          >
            {trans.field_label && (
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {trans.field_label.replace('{n}', String(index + 1))}
              </label>
            )}
            <Textarea
              value={item}
              onChange={e => {
                const next = [...items];
                next[index] = e.target.value;
                setItems(next);
              }}
              placeholder={trans.placeholder ?? ''}
              className="min-h-[80px] text-base"
            />
            {trans.reflection_prompt && (
              <p className="text-xs text-gray-500 mt-2 italic">{trans.reflection_prompt}</p>
            )}
          </motion.div>
        ))}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={() => onNext({ items })}
        disabled={!isComplete}
      />
    </motion.div>
  );
}

// ─── Input list step ──────────────────────────────────────────────────────────

function StepInputList({ trans, savedData, count, onNext, onBack }: {
  trans: any;
  savedData: any;
  count: number;
  onNext: (d?: any) => void;
  onBack: () => void;
}) {
  const [items, setItems] = useState<string[]>(
    savedData.items ?? Array(count).fill('')
  );

  const isComplete = items.every(b => b.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        {trans.step_label && (
          <p className="text-sm text-amber-600 font-medium mb-2">{trans.step_label}</p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{trans.title}</h2>
        {trans.description && (
          <p className="text-lg text-gray-600 whitespace-pre-line">{trans.description}</p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <input
              type="text"
              value={item}
              onChange={e => {
                const next = [...items];
                next[index] = e.target.value;
                setItems(next);
              }}
              placeholder={
                trans.placeholder
                  ? trans.placeholder.replace('{n}', String(index + 1))
                  : ''
              }
              className="w-full px-6 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-lg"
            />
          </motion.div>
        ))}
      </div>

      {isComplete && trans.completion_message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200"
        >
          <Check className="w-6 h-6 text-amber-600 mx-auto mb-3" />
          <p className="text-center text-amber-800">{trans.completion_message}</p>
        </motion.div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={() => onNext({ items })}
        disabled={!isComplete}
      />
    </motion.div>
  );
}

// ─── Fields step ──────────────────────────────────────────────────────────────

function StepFields({ trans, savedData, isLast, onNext, onBack }: {
  trans: any;
  savedData: any;
  isLast: boolean;
  onNext: (d?: any) => void;
  onBack: () => void;
}) {
  const fields: { key: string; label: string; placeholder: string }[] = trans.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(
    savedData.fields ?? Object.fromEntries(fields.map(f => [f.key, '']))
  );

  const isComplete = fields.every(f => values[f.key]?.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        {trans.step_label && (
          <p className="text-sm text-amber-600 font-medium mb-2">{trans.step_label}</p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{trans.title}</h2>
        {trans.description && (
          <p className="text-lg text-gray-600 whitespace-pre-line">{trans.description}</p>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {fields.map(field => (
          <div key={field.key} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="font-semibold text-gray-900 mb-3">{field.label}</h3>
            <Textarea
              value={values[field.key] ?? ''}
              onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="min-h-[100px]"
            />
          </div>
        ))}
      </div>

      {trans.closing_message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-8 border border-violet-200"
        >
          <p className="text-center text-violet-800 leading-relaxed whitespace-pre-line">
            {trans.closing_message}
          </p>
        </motion.div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={() => onNext({ fields: values })}
        disabled={!isComplete}
        isLast={isLast}
        buttonText={trans.button_text}
      />
    </motion.div>
  );
}

// ─── Shared nav buttons ───────────────────────────────────────────────────────

function NavButtons({ onBack, onNext, disabled, isLast, buttonText }: {
  onBack: () => void;
  onNext: () => void;
  disabled: boolean;
  isLast?: boolean;
  buttonText?: string;
}) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        className="rounded-xl flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Zpět
      </Button>
      <Button
        onClick={onNext}
        disabled={disabled}
        className={`rounded-xl flex items-center gap-2 ${isLast
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
          }`}
      >
        {buttonText ?? (isLast ? 'Dokončit' : 'Pokračovat')}
        {isLast
          ? <Check className="ml-2 w-4 h-4" />
          : <ChevronRight className="ml-2 w-4 h-4" />
        }
      </Button>
    </div>
  );
}

// ─── Interactive step ─────────────────────────────────────────────────────────
function StepInteractive({ trans, onNext, onBack }: {
  trans: any;
  onNext: (d?: any) => void;
  onBack: () => void;
}) {
  const CustomComponent = trans.component
    ? COMPONENT_REGISTRY[trans.component]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        {trans.step_label && (
          <p className="text-sm text-amber-600 font-medium mb-2">{trans.step_label}</p>
        )}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{trans.title}</h2>
        {trans.description && (
          <p className="text-lg text-gray-600">{trans.description}</p>
        )}
      </div>

      {CustomComponent ? (
        <div className="mb-8">
          <CustomComponent />
        </div>
      ) : (
        <div className="mb-8 p-8 bg-gray-50 rounded-2xl text-center text-gray-400">
          Komponenta &quot;{trans.component}&quot; nenalezena v registru.
        </div>
      )}

      {trans.completion_message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200"
        >
          <p className="text-center text-amber-800">{trans.completion_message}</p>
        </motion.div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={() => onNext()}
        disabled={false}              // interactive step nevyžaduje vyplnění
        buttonText={trans.button_text}
      />
    </motion.div>
  );
}
