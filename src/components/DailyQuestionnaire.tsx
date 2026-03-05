import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles, Sun, Users, Smile, ChevronRight, ChevronLeft, Check, CheckCircle2, Circle } from 'lucide-react';
import {
  dailyReflectionService,
  type DailyQuestion,
  type QuestionKey,
} from '@/lib/dailyReflectionService';

interface DailyQuestionnaireProps {
  onComplete?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  grateful:   Sparkles,
  happiest:   Sun,
  made_happy: Users,
  enjoyed:    Smile,
  energy:     Heart,
  happiness:  Heart,
};

const colorMap: Record<string, { color: string; bg: string; border: string }> = {
  grateful:   { color: 'text-violet-500', bg: 'bg-violet-50',  border: 'border-violet-200' },
  happiest:   { color: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  made_happy: { color: 'text-rose-500',   bg: 'bg-rose-50',    border: 'border-rose-200' },
  enjoyed:    { color: 'text-emerald-500',bg: 'bg-emerald-50', border: 'border-emerald-200' },
  energy:     { color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200' },
  happiness:  { color: 'text-pink-500',   bg: 'bg-pink-50',    border: 'border-pink-200' },
};

const DailyQuestionnaire = ({ onComplete }: DailyQuestionnaireProps) => {
  const { t, lang } = useLanguage();
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keeps track of which questions have been answered
  const [answered, setAnswered] = useState<Set<QuestionKey>>(new Set());

  const [answers, setAnswers] = useState<Record<QuestionKey, { text: string; number: number }>>({
    grateful:   { text: '', number: 5 },
    happiest:   { text: '', number: 5 },
    made_happy: { text: '', number: 5 },
    enjoyed:    { text: '', number: 5 },
    energy:     { text: '', number: 5 },
    happiness:  { text: '', number: 5 },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [qs, existingAnswers] = await Promise.all([
          dailyReflectionService.getQuestions(),
          dailyReflectionService.getTodayAnswers(),
        ]);

        setQuestions(qs);

        const newAnswers = { ...answers };
        const newAnswered = new Set<QuestionKey>();

        for (const ans of existingAnswers) {
          const q = qs.find(qq => qq.id === ans.question_id);
          if (!q) continue;
          const key = q.question_key as QuestionKey;
          if (ans.answer_text !== null) {
            newAnswers[key].text = ans.answer_text;
            if (ans.answer_text.trim()) newAnswered.add(key);
          }
          if (ans.answer_number !== null) {
            newAnswers[key].number = ans.answer_number;
            newAnswered.add(key);
          }
        }

        setAnswers(newAnswers);
        setAnswered(newAnswered);
      } catch (err) {
        console.error('Error loading questionnaire:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQuestion = questions[currentStep];
  const key = currentQuestion.question_key as QuestionKey;
  const isSlider = key === 'energy' || key === 'happiness';
  const Icon = iconMap[key] || Sparkles;
  const colors = colorMap[key] || { color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' };

  const trans = currentQuestion.translations[lang]
    || currentQuestion.translations['cs']
    || currentQuestion.translations['en']
    || {};
  const questionTitle = trans.title || '';
  const placeholder = trans.placeholder || t('writeHere');
  const currentAnswer = answers[key];

  const saveCurrentAnswer = async (question: DailyQuestion, qKey: QuestionKey) => {
    const slider = qKey === 'energy' || qKey === 'happiness';
    await dailyReflectionService.upsertAnswer(
      question,
      slider
        ? { answer_number: answers[qKey].number }
        : { answer_text: answers[qKey].text }
    );

    // Mark as answered
    setAnswered(prev => {
      const next = new Set(prev);
      const hasValue = slider
        ? true // slider always has a value
        : answers[qKey].text.trim().length > 0;
      if (hasValue) next.add(qKey);
      return next;
    });
  };

  const handleStepClick = async (index: number) => {
    // Save current before jumping
    await saveCurrentAnswer(currentQuestion, key);
    setCurrentStep(index);
  };

  const handleNext = async () => {
    await saveCurrentAnswer(currentQuestion, key);
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = async () => {
    await saveCurrentAnswer(currentQuestion, key);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await saveCurrentAnswer(currentQuestion, key);
      setIsComplete(true);
    } catch (err) {
      console.error('Error saving reflection:', err);
    }
  };

  // --- Completion screen ---
  if (isComplete) {
    const energyQ = questions.find(q => q.question_key === 'energy');
    const happinessQ = questions.find(q => q.question_key === 'happiness');
    const energyTitle = (energyQ?.translations[lang] || energyQ?.translations['cs'])?.title || t('question5Energy');
    const happinessTitle = (happinessQ?.translations[lang] || happinessQ?.translations['cs'])?.title || t('question5Happiness');

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 items-center justify-center shadow-lg mb-6"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('thankYou')}
            </h2>

            <div className="space-y-4 mb-8">
              {/* Energy bar */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{energyTitle}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                    {answers.energy.number}
                    <span className="text-sm text-gray-300 font-light">/10</span>
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <div
                      key={n}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: n <= answers.energy.number
                          ? `hsl(${40 + n * 12}, 80%, 55%)`
                          : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Happiness bar */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{happinessTitle}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                    {answers.happiness.number}
                    <span className="text-sm text-gray-300 font-light">/10</span>
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <div
                      key={n}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: n <= answers.happiness.number
                          ? `hsl(${280 + n * 5}, 70%, 60%)`
                          : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                if (onComplete) {
                  onComplete();
                } else {
                  setIsComplete(false);
                  setCurrentStep(0);
                }
              }}
              size="lg"
              className="w-full py-6 rounded-2xl text-lg bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 hover:from-amber-600 hover:via-violet-600 hover:to-rose-600 text-white shadow-xl"
            >
              {t('startJourney')}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- Main questionnaire ---
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('dailyQuestionnaireTitle')}
          </h1>
          <p className="text-gray-500">{t('dailyQuestionnaireSubtitle')}</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Question sidebar – right */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                {t('dailyQuestionnaireTitle') || 'Otázky'}
              </h3>

              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {questions.map((q, index) => {
                  const qKey = q.question_key as QuestionKey;
                  const isActive = index === currentStep;
                  const isDone = answered.has(qKey);
                  const QIcon = iconMap[qKey] || Sparkles;
                  const qColors = colorMap[qKey] || { color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' };
                  const qTrans = q.translations[lang]
                    || q.translations['cs']
                    || q.translations['en']
                    || {};

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleStepClick(index)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 whitespace-nowrap lg:whitespace-normal min-w-fit ${
                        isActive
                          ? `bg-white shadow-md border ${qColors.border}`
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <QIcon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? qColors.color : 'text-gray-300'
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {qTrans.title || qKey}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tlačítko přeskočit */}
              {onComplete && (
                <div className="mt-6 hidden lg:block">
                  <Button
                    variant="ghost"
                    onClick={onComplete}
                    className="w-full rounded-xl text-gray-500"
                  >
                    Přeskočit reflexi
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Question card – left/main */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
              >
                {/* Question header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 ${colors.bg} ${colors.border}`}>
                    <Icon className={`h-7 w-7 ${colors.color}`} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      {currentStep + 1}/{questions.length}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {questionTitle}
                    </h3>
                  </div>
                </div>

                {/* Slider or Textarea */}
                {isSlider ? (
                  <div className="py-4">
                    <div className="text-center mb-6">
                      <span className="text-6xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                        {currentAnswer.number}
                      </span>
                      <span className="text-2xl text-gray-300 font-light">/10</span>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button
                          key={n}
                          onClick={() =>
                            setAnswers(prev => ({
                              ...prev,
                              [key]: { ...prev[key], number: n },
                            }))
                          }
                          className={`flex-1 h-12 rounded-2xl text-sm font-bold transition-all duration-300 ${
                            n <= currentAnswer.number
                              ? 'text-white shadow-md transform scale-105'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          style={n <= currentAnswer.number ? {
                            background: `linear-gradient(135deg, hsl(${40 + n * 12}, 90%, 55%), hsl(${40 + n * 12}, 90%, 45%))`
                          } : {}}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={currentAnswer.text}
                    onChange={e =>
                      setAnswers(prev => ({
                        ...prev,
                        [key]: { ...prev[key], text: e.target.value },
                      }))
                    }
                    placeholder={placeholder}
                    className="min-h-[150px] border-gray-200 rounded-2xl text-base resize-none focus-visible:ring-amber-500/20"
                  />
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('back') || 'Zpět'}</span>
                  </Button>

                  {currentStep === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 hover:from-amber-600 hover:via-violet-600 hover:to-rose-600 text-white shadow-lg px-6"
                    >
                      <Check className="h-4 w-4" />
                      {t('submit') || 'Dokončit'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex items-center gap-2 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white px-6"
                    >
                      <span className="hidden sm:inline">{t('next') || 'Další'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>         

        </div>
      </div>
    </div>
  );
};

export default DailyQuestionnaire;
