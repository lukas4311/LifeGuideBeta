import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Heart, Sparkles, Sun, Users, Smile, ChevronRight, ChevronLeft, Check } from 'lucide-react';
// import EnergyMeter from './EnergyMeter';
import {
  dailyReflectionService,
  type DailyQuestion,
  type ReflectionAnswer,
  type QuestionKey,
} from '@/lib/dailyReflectionService';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  grateful: Sparkles,
  happiest: Sun,
  made_happy: Users,
  enjoyed: Smile,
  energy: Heart,
  happiness: Heart,
};

const colorMap: Record<string, { color: string; bgColor: string }> = {
  grateful: { color: 'text-module-identity',       bgColor: 'bg-module-identity/10' },
  happiest: { color: 'text-module-energy',         bgColor: 'bg-module-energy/10' },
  made_happy: { color: 'text-module-relationships', bgColor: 'bg-module-relationships/10' },
  enjoyed: { color: 'text-module-knowledge',       bgColor: 'bg-module-knowledge/10' },
  energy: { color: 'text-module-navigation',       bgColor: 'bg-module-navigation/10' },
  happiness: { color: 'text-module-navigation',    bgColor: 'bg-module-navigation/10' },
};

const DailyQuestionnaire = ({onComplete}: {onComplete?: () => void}) => {
  const { t, lang } = useLanguage(); // lang: 'cs' | 'en'
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mapa odpovědí: question_key → objekt s odpovědí (text / number)
  const [answers, setAnswers] = useState<Record<QuestionKey, { text: string; number: number }>>({
    grateful: { text: '', number: 5 },
    happiest: { text: '', number: 5 },
    made_happy: { text: '', number: 5 },
    enjoyed: { text: '', number: 5 },
    energy: { text: '', number: 5 },
    happiness: { text: '', number: 5 },
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

        // načtení hodnot z odpovědí
        const newAnswers = { ...answers };
        for (const ans of existingAnswers) {
          const q = qs.find(qq => qq.id === ans.question_id);
          if (!q) continue;

          const key = q.question_key as QuestionKey;
          if (ans.answer_text !== null) {
            newAnswers[key].text = ans.answer_text;
          }
          if (ans.answer_number !== null) {
            newAnswers[key].number = ans.answer_number;
          }
        }
        setAnswers(newAnswers);
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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!questions.length) {
    return null;
  }

  const currentQuestion = questions[currentStep];
  const key = currentQuestion.question_key as QuestionKey;
  const isSlider = key === 'energy' || key === 'happiness';

  const iconKey = currentQuestion.question_key;
  const Icon = iconMap[iconKey] || Sparkles;
  const colors = colorMap[iconKey] || { color: 'text-primary', bgColor: 'bg-primary/10' };

  const trans = currentQuestion.translations[lang] || currentQuestion.translations['cs'] || currentQuestion.translations['en'] || {};
  const questionTitle = trans.title;
  const placeholder = trans.placeholder || t('writeHere');

  const currentAnswer = answers[key];

  const handleTextChange = (value: string) => {
    const v = value.trim() || '';
    setAnswers(prev => ({ ...prev, [key]: { ...prev[key], text: v } }));
  };

  const handleNumberChange = (value: number) => {
    setAnswers(prev => ({ ...prev, [key]: { ...prev[key], number: value } }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      // uloží aktuální odpověď při přechodu
      await dailyReflectionService.upsertAnswer(
        currentQuestion,
        key === 'energy' || key === 'happiness'
          ? { answer_number: currentAnswer.number }
          : { answer_text: currentAnswer.text }
      );
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = async () => {
    if (currentStep > 0) {
      // volitelně ukládej i při zpětném přechodu
      await dailyReflectionService.upsertAnswer(
        currentQuestion,
        key === 'energy' || key === 'happiness'
          ? { answer_number: currentAnswer.number }
          : { answer_text: currentAnswer.text }
      );

      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // uložní aktuální krok + případně všechny otázky
      await dailyReflectionService.upsertAnswer(
        currentQuestion,
        key === 'energy' || key === 'happiness'
          ? { answer_number: currentAnswer.number }
          : { answer_text: currentAnswer.text }
      );

      // nepovinné: dotahne znovu z DB, aby klient měl konzistentní stav
      // setAnswers z nových odpovědí...

      setIsComplete(true);
    } catch (err) {
      console.error('Error saving reflection:', err);
    }
  };

  if (isComplete) {
    const energy = questions.find(q => q.question_key === 'energy');
    const happiness = questions.find(q => q.question_key === 'happiness');

    const energyTrans = (energy?.translations[lang] || energy?.translations['cs'] || energy?.translations['en'] || { title: '' }).title;
    const happinessTrans = (happiness?.translations[lang] || happiness?.translations['cs'] || happiness?.translations['en'] || { title: '' }).title;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-sunrise shadow-glow"
        >
          <Check className="h-12 w-12 text-white" />
        </motion.div>
        <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
          {t('thankYou')}
        </h2>
        {/* <div className="mb-6 space-y-4 w-full max-w-xs">
          <EnergyMeter
            value={answers.energy.number}
            label={energyTrans || t('question5Energy')}
          />
          <EnergyMeter
            value={answers.happiness.number}
            label={happinessTrans || t('question5Happiness')}
            variant="happiness"
          />
        </div> */}
        <Button
          onClick={() => {
            setIsComplete(false);
            setCurrentStep(0);
            // nebo dotáhnout znovu z DB
          }}
          className="bg-gradient-sunrise text-white font-semibold hover:shadow-glow transition-all"
        >
          {t('startJourney')}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {questions.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-primary'
                : index < currentStep
                ? 'w-2 bg-primary/60'
                : 'w-2 bg-muted'
            }`}
            animate={{ scale: index === currentStep ? 1.1 : 1 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`p-8 glass shadow-soft ${colors.bgColor}`}>
            <div className="mb-6 flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bgColor}`}>
                <Icon className={`h-7 w-7 ${colors.color}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {currentStep + 1}/{questions.length}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {questionTitle}
                </h3>
              </div>
            </div>

            {isSlider ? (
              <div className="space-y-8 py-4">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">
                    {t(`question5${key.charAt(0).toUpperCase() + key.slice(1)}`) || questionTitle}
                  </label>
                  <Slider
                    value={[currentAnswer.number]}
                    onValueChange={(value) => handleNumberChange(value[0])}
                    max={10}
                    min={0}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span className="font-display text-2xl font-bold text-primary">
                      {currentAnswer.number}
                    </span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            ) : (
              <Textarea
                value={currentAnswer.text}
                onChange={e => handleTextChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[150px] resize-none border-none bg-white/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20"
              />
            )}

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('back') || 'Back'}</span>
              </Button>

              {currentStep === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-sunrise text-white font-semibold hover:shadow-glow transition-all flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {t('submit')}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-sunrise text-white font-semibold hover:shadow-glow transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">{t('next') || 'Next'}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DailyQuestionnaire;
