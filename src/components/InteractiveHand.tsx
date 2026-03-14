import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Sparkles, Heart as HeartIcon, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

const fingers = [
  { 
    id: 'thumb', 
    titleKey: 'thumbTitle',
    color: '#a3be8c',
    activeColor : '#88a76f',
    position: { x: 70, y: 320 },
    path: "M 100 300 Q 50 285 35 245 Q 25 205 45 175 Q 65 160 85 180 L 110 280 Z"
  },
  { 
    id: 'index', 
    titleKey: 'indexTitle',
    color: '#ebcb8b',
    activeColor: '#d9b97a',
    position: { x: 145, y: 110 },
    path: "M 115 280 L 135 80 Q 140 40 160 35 Q 180 32 185 55 L 165 280 Z"
  },
  { 
    id: 'middle', 
    titleKey: 'middleTitle',
    color: '#a3be8c',
    activeColor: '#88a76f',
    position: { x: 210, y: 60 },
    path: "M 165 280 L 195 35 Q 200 15 215 15 Q 230 15 235 35 L 215 280 Z"
  },
  { 
    id: 'ring', 
    titleKey: 'ringTitle',
    color: '#bf616a',
    activeColor: '#a54d56',
    position: { x: 270, y: 100 },
    path: "M 215 280 L 245 75 Q 250 50 265 47 Q 280 45 285 65 L 265 280 Z"
  },
  { 
    id: 'pinky', 
    titleKey: 'pinkyTitle',
    color: '#88c0d0',
    activeColor: '#6fa8ba',
    position: { x: 320, y: 165 },
    path: "M 265 280 L 295 145 Q 300 115 315 110 Q 330 107 333 125 L 305 280 Z"
  },
];

const FingerDetail = ({ finger, onClose }) => {
  const { t } = useLanguage();
  const [answer, setAnswer] = useState('');
  const [talents, setTalents] = useState(['', '', '']);
  const [selectedOption, setSelectedOption] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);

  useEffect(() => {
    const loadPreviousAnswer = async () => {
      const reflections = [];//await base44.entities.HandReflection.filter({ finger: finger.id });
      if (reflections.length > 0) {
        const latest = reflections[0];
        setAnswer(latest.answer || '');
        if (finger.id === 'middle' && latest.answer) {
          const savedTalents = latest.answer.split('|||');
          setTalents(savedTalents.length === 3 ? savedTalents : ['', '', '']);
        }
        if (finger.id === 'ring' && latest.answer) {
          setSelectedOption(latest.answer);
        }
      }
    };
    loadPreviousAnswer();
  }, [finger.id]);

  const handleSave = async () => {
    setSaving(true);
    let answerToSave = answer;
    
    if (finger.id === 'middle') {
      answerToSave = talents.join('|||');
    } else if (finger.id === 'ring') {
      answerToSave = selectedOption;
    }

    // const existing = await base44.entities.HandReflection.filter({ finger: finger.id });
    
    // if (existing.length > 0) {
    //   await base44.entities.HandReflection.update(existing[0].id, {
    //     answer: answerToSave,
    //     completed: true
    //   });
    // } else {
    //   await base44.entities.HandReflection.create({
    //     finger: finger.id,
    //     answer: answerToSave,
    //     completed: true
    //   });
    // }
    
    // toast.success(t('answerSaved'));
    setShowAffirmation(true);
    setSaving(false);
  };

  const getAffirmationKey = () => {
    const affirmationMap = {
      thumb: 'thumbAffirmation',
      index: 'indexAffirmation',
      middle: 'middleAffirmation',
      ring: 'ringAffirmation',
      pinky: 'pinkyAffirmation'
    };
    return affirmationMap[finger.id];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="bg-white rounded-3xl p-8 shadow-2xl relative border border-gray-100"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="mb-6">
        <h3 className="text-3xl font-bold mb-3" style={{ color: finger.activeColor }}>
          {t(finger.titleKey)}
        </h3>
        <div className="h-1 w-20 rounded-full mb-4" style={{ backgroundColor: finger.color }} />
        <p className="text-gray-600 text-lg mb-2">
          <span className="font-semibold text-gray-900">{t('principle')}</span>
        </p>
        <p className="text-gray-700 leading-relaxed">
          {t(`${finger.id}Principle`)}
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
        <p className="font-semibold text-gray-900 mb-3">{t(`${finger.id}Questions`)}</p>
        <ul className="space-y-2">
          {finger.id === 'thumb' && (
            <>
              <li className="text-gray-600">• {t('thumbQ1')}</li>
              <li className="text-gray-600">• {t('thumbQ2')}</li>
              <li className="text-gray-600">• {t('thumbQ3')}</li>
            </>
          )}
          {finger.id === 'index' && (
            <>
              <li className="text-gray-600">• {t('indexQ1')}</li>
              <li className="text-gray-600">• {t('indexQ2')}</li>
              <li className="text-gray-600">• {t('indexQ3')}</li>
            </>
          )}
          {finger.id === 'middle' && (
            <>
              <li className="text-gray-600">• {t('middleQ1')}</li>
              <li className="text-gray-600">• {t('middleQ2')}</li>
              <li className="text-gray-600">• {t('middleQ3')}</li>
            </>
          )}
          {finger.id === 'ring' && (
            <>
              <li className="text-gray-600">• {t('ringQ1')}</li>
              <li className="text-gray-600">• {t('ringQ2')}</li>
              <li className="text-gray-600">• {t('ringQ3')}</li>
              <li className="text-gray-600">• {t('ringQ4')}</li>
              <li className="text-gray-600">• {t('ringQ5')}</li>
              <li className="text-gray-600">• {t('ringQ6')}</li>
              <li className="text-gray-600">• {t('ringQ7')}</li>
            </>
          )}
          {finger.id === 'pinky' && (
            <>
              <li className="text-gray-600">• {t('pinkyQ1')}</li>
              <li className="text-gray-600">• {t('pinkyQ2')}</li>
              <li className="text-gray-600">• {t('pinkyQ3')}</li>
            </>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-900 mb-3">{t('exercise')}</p>
        <p className="text-gray-600 mb-4">{t(`${finger.id}Exercise`)}</p>
        
        {finger.id === 'middle' ? (
          <div className="space-y-3">
            <Input
              placeholder={t('middleTalent1')}
              value={talents[0]}
              onChange={(e) => setTalents([e.target.value, talents[1], talents[2]])}
              className="w-full"
            />
            <Input
              placeholder={t('middleTalent2')}
              value={talents[1]}
              onChange={(e) => setTalents([talents[0], e.target.value, talents[2]])}
              className="w-full"
            />
            <Input
              placeholder={t('middleTalent3')}
              value={talents[2]}
              onChange={(e) => setTalents([talents[0], talents[1], e.target.value])}
              className="w-full"
            />
          </div>
        ) : finger.id === 'ring' ? (
          <div className="space-y-2">
            {['ringOption1', 'ringOption2', 'ringOption3', 'ringOption4'].map((optionKey) => (
              <button
                key={optionKey}
                onClick={() => setSelectedOption(t(optionKey))}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  selectedOption === t(optionKey)
                    ? 'bg-rose-100 border-2 border-rose-400 text-rose-900'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-rose-300 text-gray-700'
                }`}
              >
                {t(optionKey)}
              </button>
            ))}
          </div>
        ) : finger.id === 'pinky' ? (
          <div className="space-y-3 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-gray-800">{t('pinkyStep1')}</p>
              <p className="text-lg font-medium text-gray-800">{t('pinkyStep2')}</p>
              <p className="text-lg font-medium text-gray-800">{t('pinkyStep3')}</p>
            </div>
            <Textarea
              placeholder={t('heartExercise')}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full min-h-[80px] mt-4"
            />
          </div>
        ) : (
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full min-h-[120px]"
            placeholder="..."
          />
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving || (!answer && finger.id !== 'middle' && finger.id !== 'ring') || (finger.id === 'middle' && !talents[0]) || (finger.id === 'ring' && !selectedOption)}
        className="w-full rounded-xl text-lg h-12"
        style={{ backgroundColor: finger.activeColor }}
      >
        {saving ? '...' : (finger.id === 'thumb' ? t('thumbButton') : t('complete'))}
      </Button>

      <AnimatePresence>
        {showAffirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200"
          >
            <p className="text-center text-lg font-medium text-gray-800 italic">
              "{t(getAffirmationKey())}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const HeartDetail = ({ onClose }) => {
  const { t } = useLanguage();
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);

  useEffect(() => {
    const loadPreviousAnswer = async () => {
      const reflections = [];//await base44.entities.HandReflection.filter({ finger: 'heart' });
      if (reflections.length > 0) {
        setAnswer(reflections[0].answer || '');
      }
    };
    loadPreviousAnswer();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // const existing = await base44.entities.HandReflection.filter({ finger: 'heart' });
    
    // if (existing.length > 0) {
    //   await base44.entities.HandReflection.update(existing[0].id, {
    //     answer: answer,
    //     completed: true
    //   });
    // } else {
    //   await base44.entities.HandReflection.create({
    //     finger: 'heart',
    //     answer: answer,
    //     completed: true
    //   });
    // }
    
    // toast.success(t('answerSaved'));
    setShowAffirmation(true);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 rounded-3xl p-8 shadow-2xl relative border-2 border-rose-200"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-all"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <HeartIcon className="w-16 h-16 text-rose-500 fill-rose-500" />
        </motion.div>
        <h3 className="text-3xl font-bold text-rose-600 mb-3">
          {t('heartTitle')}
        </h3>
      </div>

      <div className="mb-6 text-center">
        <p className="text-gray-700 leading-relaxed mb-4">
          {t('heartIntro')}
        </p>
        <div className="p-4 bg-white/60 rounded-2xl mb-4">
          <p className="text-lg font-medium text-gray-800 italic">
            "{t('heartQuote')}"
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {t('heartText')}
        </p>
      </div>

      <div className="mb-6 p-4 bg-white/60 rounded-2xl">
        <p className="font-semibold text-gray-900 mb-3">{t('heartQuestions')}</p>
        <ul className="space-y-2">
          <li className="text-gray-600">• {t('heartQ1')}</li>
          <li className="text-gray-600">• {t('heartQ2')}</li>
          <li className="text-gray-600">• {t('heartQ3')}</li>
          <li className="text-gray-600">• {t('heartQ4')}</li>
          <li className="text-gray-600">• {t('heartQ5')}</li>
          <li className="text-gray-600">• {t('heartQ6')}</li>
        </ul>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-900 mb-3">{t('exercise')}</p>
        <p className="text-gray-600 mb-4">{t('heartExercise')}</p>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full min-h-[120px] bg-white/80"
          placeholder="..."
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={saving || !answer}
        className="w-full rounded-xl text-lg h-12 bg-rose-500 hover:bg-rose-600"
      >
        {saving ? '...' : t('complete')}
      </Button>

      <AnimatePresence>
        {showAffirmation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-6 rounded-2xl bg-white/80 border border-rose-300"
          >
            <p className="text-center text-lg font-medium text-gray-800 italic">
              "{t('heartAffirmation')}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function InteractiveHand() {
  const { t } = useLanguage();
  const [selectedFinger, setSelectedFinger] = useState(null);
  const [showHeart, setShowHeart] = useState(false);
  const [hoveredFinger, setHoveredFinger] = useState(null);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {t('handTitle')}
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          {t('handIntro')}
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('handDescription')}
        </p>
      </div>

      <div className="relative max-w-lg mx-auto mb-8">
        <svg viewBox="0 0 400 450" className="w-full h-auto drop-shadow-2xl">
          {/* Palm - natural skin tone */}
          <path
            d="M 100 300 Q 80 350 95 405 L 305 405 Q 320 350 300 300 L 100 300 Z"
            fill="#f5d5c1"
            stroke="#e8b4a4"
            strokeWidth="3"
            opacity="0.95"
          />
          
          {/* Fingers with natural skin tone */}
          {fingers.map(finger => (
            <motion.path
              key={finger.id}
              d={finger.path}
              fill={hoveredFinger === finger.id || selectedFinger?.id === finger.id ? finger.activeColor : '#f5d5c1'}
              stroke={selectedFinger?.id === finger.id ? finger.activeColor : '#e8b4a4'}
              strokeWidth={selectedFinger?.id === finger.id ? '3' : '2'}
              className="cursor-pointer transition-all"
              onClick={() => setSelectedFinger(finger)}
              onMouseEnter={() => setHoveredFinger(finger.id)}
              onMouseLeave={() => setHoveredFinger(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                filter: hoveredFinger === finger.id ? 'brightness(1.1)' : 'none',
                transition: 'all 0.3s ease'
              }}
            />
          ))}

          {/* Heart on palm - matching reference style */}
          <motion.g
            className="cursor-pointer"
            onClick={() => setShowHeart(true)}
            onMouseEnter={() => setHoveredFinger('heart')}
            onMouseLeave={() => setHoveredFinger(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={showHeart ? { scale: [1, 1.1, 1] } : hoveredFinger === 'heart' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: (showHeart || hoveredFinger === 'heart') ? Infinity : 0 }}
          >
            {/* Heart shape */}
            <path
              d="M 200 365 Q 185 355 175 345 Q 165 335 165 320 Q 165 300 185 295 Q 200 293 200 300 Q 200 293 215 295 Q 235 300 235 320 Q 235 335 225 345 Q 215 355 200 365 Z"
              fill={hoveredFinger === 'heart' || showHeart ? '#e63946' : '#d62839'}
              stroke="#c1121f"
              strokeWidth="2"
              className="transition-all"
              style={{ filter: hoveredFinger === 'heart' ? 'drop-shadow(0 0 10px rgba(230, 57, 70, 0.8))' : 'none' }}
            />
            {/* Smiley face on heart */}
            <circle cx="193" cy="325" r="2" fill="white" />
            <circle cx="207" cy="325" r="2" fill="white" />
            <path d="M 190 335 Q 200 340 210 335" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Decorative icons on fingers - matching reference style */}
          {fingers.map((finger, index) => {
            return (
              <motion.g
                key={`indicator-${finger.id}`}
                className="cursor-pointer"
                onClick={() => setSelectedFinger(finger)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {finger.id === 'thumb' && (
                  <>
                    {/* Four colored pluses on thumb - positioned on the thumb itself */}
                    <text x="62" y="235" fontSize="16" fontWeight="bold" fill="#ebcb8b">+</text>
                    <text x="78" y="235" fontSize="16" fontWeight="bold" fill="#a3be8c">+</text>
                    <text x="62" y="250" fontSize="16" fontWeight="bold" fill="#88c0d0">+</text>
                    <text x="78" y="250" fontSize="16" fontWeight="bold" fill="#bf616a">+</text>
                  </>
                )}
                {finger.id === 'index' && (
                  <>
                    {/* Person icon on index finger */}
                    <circle cx={finger.position.x} cy={finger.position.y} r="22" fill={selectedFinger?.id === finger.id ? finger.activeColor : finger.color} opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                    <circle cx={finger.position.x} cy={finger.position.y - 3} r="4" fill="#d08770" />
                    <path d={`M ${finger.position.x} ${finger.position.y + 2} L ${finger.position.x - 5} ${finger.position.y + 12} M ${finger.position.x} ${finger.position.y + 2} L ${finger.position.x + 5} ${finger.position.y + 12} M ${finger.position.x} ${finger.position.y + 2} L ${finger.position.x} ${finger.position.y + 8} M ${finger.position.x - 5} ${finger.position.y + 5} L ${finger.position.x + 5} ${finger.position.y + 5}`} stroke="#d08770" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
                {finger.id === 'middle' && (
                  <>
                    <circle cx={finger.position.x} cy={finger.position.y} r="18" fill={selectedFinger?.id === finger.id ? finger.activeColor : finger.color} opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                    <text x={finger.position.x} y={finger.position.y + 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">🎨</text>
                  </>
                )}
                {finger.id === 'ring' && (
                  <>
                    {/* Smiling lips icon on ring finger */}
                    <circle cx={finger.position.x} cy={finger.position.y} r="22" fill={selectedFinger?.id === finger.id ? finger.activeColor : finger.color} opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                    {/* Upper lip - curved smile */}
                    <path d={`M ${finger.position.x - 10} ${finger.position.y} Q ${finger.position.x} ${finger.position.y - 6} ${finger.position.x + 10} ${finger.position.y}`} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Lower lip - curved smile */}
                    <path d={`M ${finger.position.x - 10} ${finger.position.y} Q ${finger.position.x} ${finger.position.y + 6} ${finger.position.x + 10} ${finger.position.y}`} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}
                {finger.id === 'pinky' && (
                  <>
                    <circle cx={finger.position.x} cy={finger.position.y} r="18" fill={selectedFinger?.id === finger.id ? finger.activeColor : finger.color} opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                    <text x={finger.position.x} y={finger.position.y + 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">😊</text>
                  </>
                )}
              </motion.g>
            );
          })}

          {/* Tooltip */}
          {hoveredFinger && hoveredFinger !== 'heart' && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              {(() => {
                const finger = fingers.find(f => f.id === hoveredFinger);
                const tooltipWidth = 140;
                return (
                  <>
                    <rect
                      x={finger.position.x - tooltipWidth / 2}
                      y={finger.position.y - 55}
                      width={tooltipWidth}
                      height="32"
                      rx="16"
                      fill={finger.color}
                      opacity="0.95"
                      filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
                    />
                    <text
                      x={finger.position.x}
                      y={finger.position.y - 33}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill="white"
                      className="select-none uppercase tracking-wide"
                    >
                      {t(finger.titleKey)}
                    </text>
                  </>
                );
              })()}
            </motion.g>
          )}
          {hoveredFinger === 'heart' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x={130}
                y={360}
                width={140}
                height="30"
                rx="15"
                fill="#e63946"
                opacity="0.95"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
              />
              <text
                x={200}
                y={381}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="white"
                className="select-none uppercase tracking-wide"
              >
                {t('heartTitle')}
              </text>
            </motion.g>
          )}
        </svg>

        {!selectedFinger && !showHeart && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              {t('clickFingers')}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedFinger && (
          <div className="mt-8">
            <FingerDetail 
              finger={selectedFinger} 
              onClose={() => setSelectedFinger(null)} 
            />
          </div>
        )}
        {showHeart && (
          <div className="mt-8">
            <HeartDetail onClose={() => setShowHeart(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}