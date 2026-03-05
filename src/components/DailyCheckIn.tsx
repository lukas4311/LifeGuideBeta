import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sun, Cloud, CloudRain, Zap, Heart, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { dailyCheckinService } from '@/lib/dailyCheckin';
import DailyQuestionnaire from './DailyQuestionnaire'; // IMPORT TVÉ KOMPONENTY

const moodIcons = {
  radiant:    { icon: Sun,       color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200',   gradient: 'from-amber-400 to-orange-500' },
  positive:   { icon: Zap,       color: 'text-green-500', bg: 'bg-green-50 border-green-200',   gradient: 'from-green-400 to-emerald-500' },
  neutral:    { icon: Cloud,     color: 'text-blue-400',  bg: 'bg-blue-50 border-blue-200',     gradient: 'from-blue-400 to-sky-500' },
  low:        { icon: CloudRain, color: 'text-gray-400',  bg: 'bg-gray-50 border-gray-200',     gradient: 'from-gray-400 to-gray-500' },
  struggling: { icon: Heart,     color: 'text-rose-400',  bg: 'bg-rose-50 border-rose-200',     gradient: 'from-rose-400 to-pink-500' },
} as const;

const moods = ['radiant', 'positive', 'neutral', 'low', 'struggling'] as const;
type MoodKey = typeof moods[number];

export default function DailyCheckIn() {
  const { t } = useLanguage();
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState<MoodKey | ''>('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [todayDone, setTodayDone] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stav pro zobrazení dotazníku
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Načti historii + dnešní záznam
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const hist = await dailyCheckinService.getHistory(30);
        setHistory(hist);

        const todayCheckIn = hist.find((c: any) => c.date === today);
        if (todayCheckIn) {
          setTodayDone(true);
          setEnergy(todayCheckIn.energy_level);
          setMood(todayCheckIn.mood as MoodKey);
          setNote(todayCheckIn.note || '');
        }
      } catch (error) {
        console.error('Error loading check-ins:', error);
        toast.error('Nepodařilo se načíst denní check-iny');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [today]);

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    try {
      const saved = await dailyCheckinService.upsertToday({
        energy_level: energy,
        mood,
        note,
      });

      setTodayDone(true);

      // Update history
      setHistory(prev => {
        const withoutToday = prev.filter(c => c.date !== saved.date);
        return [saved, ...withoutToday].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });

      toast.success(t('checkInSaved'));
      
      // Po úspěšném uložení automaticky zobraz dotazník
      setShowQuestionnaire(true);
      
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Nepodařilo se uložit check-in');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  // POKUD JE AKTIVNÍ DOTAZNÍK, VYKRESLI JEJ
  if (showQuestionnaire) {
    return (
      <div className="min-h-screen py-12 px-4 relative">
        {/* Tlačítko pro zavření/přeskočení dotazníku */}
        <div className="max-w-2xl mx-auto mb-4 flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => setShowQuestionnaire(false)}
            className="text-gray-500 hover:text-gray-900"
          >
            Přeskočit reflexi ✕
          </Button>
        </div>
        
        {/* Vložená oddělená komponenta */}
        <DailyQuestionnaire onComplete={() => setShowQuestionnaire(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 items-center justify-center shadow-lg mb-6">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('howAreYou')}
          </h1>
          <p className="text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </motion.div>

        {/* Info o uložení + tlačítko pro vyvolání dotazníku manuálně */}
        <AnimatePresence>
          {todayDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">{t('checkInSaved')}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowQuestionnaire(true)}
                  className="bg-white text-green-700 border-green-200 hover:bg-green-100"
                >
                  Denní reflexe →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Energy slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {t('energyLevel')}
          </h3>
          <div className="text-center mb-6">
            <span className="text-6xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              {energy}
            </span>
            <span className="text-2xl text-gray-300 font-light">/10</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <button
                key={n}
                onClick={() => setEnergy(n)}
                className={`flex-1 h-14 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  n <= energy
                    ? 'text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                style={n <= energy ? {
                  background: `linear-gradient(135deg, hsl(${40 + n * 12}, 90%, 55%), hsl(${40 + n * 12}, 90%, 45%))`
                } : {}}
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mood selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {t('yourMood')}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {moods.map(m => {
              const moodData = moodIcons[m];
              const MoodIcon = moodData.icon;
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected 
                      ? `${moodData.bg} shadow-md scale-105` 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <MoodIcon className={`w-8 h-8 ${isSelected ? moodData.color : 'text-gray-300'}`} />
                  <span className={`text-xs font-medium ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                    {t(m)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8"
        >
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('addNote')}
            className="min-h-[120px] border-gray-200 rounded-2xl text-base resize-none focus-visible:ring-amber-500/20"
          />
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSave}
            disabled={!mood || saving}
            size="lg"
            className="w-full py-6 rounded-2xl text-lg bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 hover:from-amber-600 hover:via-violet-600 hover:to-rose-600 text-white shadow-xl disabled:opacity-50"
          >
            {saving ? '...' : t('saveCheckIn')}
          </Button>
        </motion.div>

        {/* Recent history */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('energyTrend')}</h3>
            <div className="flex gap-1.5 items-end h-32">
              {history.slice(0, 14).reverse().map((checkIn) => {
                const height = (checkIn.energy_level / 10) * 100;
                return (
                  <div key={checkIn.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">{checkIn.energy_level}</span>
                    <div 
                      className="w-full rounded-xl transition-all duration-500"
                      style={{ 
                        height: `${height}%`, 
                        background: `linear-gradient(to top, hsl(${40 + checkIn.energy_level * 12}, 80%, 50%), hsl(${40 + checkIn.energy_level * 12}, 80%, 65%))`,
                        minHeight: '8px'
                      }}
                    />
                    <span className="text-[9px] text-gray-300">
                      {format(new Date(checkIn.date), 'dd')}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
