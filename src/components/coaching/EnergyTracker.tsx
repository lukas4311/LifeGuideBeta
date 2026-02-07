import React, { useState } from 'react';
import { Heart, Brain, Sparkles, Sun, Moon, Droplets, Wind, Hand } from 'lucide-react';

interface EnergyLevel {
  body: number;
  mind: number;
  soul: number;
}

const EnergyTracker: React.FC = () => {
  const [energyLevels, setEnergyLevels] = useState<EnergyLevel>({
    body: 5,
    mind: 5,
    soul: 5,
  });
  const [selectedArea, setSelectedArea] = useState<'body' | 'mind' | 'soul' | null>(null);

  const areas = [
    {
      key: 'body' as const,
      title: 'Tělo',
      subtitle: 'pečuj, trénuj',
      icon: <Heart className="w-8 h-8" />,
      color: '#F4A89F',
      tips: [
        'Kvalitní strava',
        'Dostatek spánku',
        'Vědomé dýchání',
        'Pravidelný pohyb',
        'Láskyplný dotek',
      ],
    },
    {
      key: 'mind' as const,
      title: 'Mysl',
      subtitle: 'vyprázdni, myšlenky vybírej',
      icon: <Brain className="w-8 h-8" />,
      color: '#7DD4D4',
      tips: [
        'Meditace',
        'Kvalitní myšlenky',
        'Inspirativní čtení',
        'Digitální detox',
        'Pozitivní afirmace',
      ],
    },
    {
      key: 'soul' as const,
      title: 'Duše',
      subtitle: 'čti, tanči, tvoř, zpívej...',
      icon: <Sparkles className="w-8 h-8" />,
      color: '#7B68BE',
      tips: [
        'Tvořivá činnost',
        'Hudba a tanec',
        'Příroda',
        'Duchovní praxe',
        'Radost z maličkostí',
      ],
    },
  ];

  const handleSliderChange = (key: 'body' | 'mind' | 'soul', value: number) => {
    setEnergyLevels(prev => ({ ...prev, [key]: value }));
  };

  const getOverallEnergy = () => {
    return Math.round((energyLevels.body + energyLevels.mind + energyLevels.soul) / 3);
  };

  const getVibrationLevel = () => {
    const overall = getOverallEnergy();
    if (overall >= 8) return { text: 'Vysoká vibrace', color: '#22C55E', emoji: '✨' };
    if (overall >= 5) return { text: 'Střední vibrace', color: '#F59E0B', emoji: '🌟' };
    return { text: 'Nízká vibrace', color: '#EF4444', emoji: '💫' };
  };

  const vibration = getVibrationLevel();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Energetický audit
        </h3>
        <p className="text-gray-600 text-lg">
          Ohodnoť svou energii v oblasti těla, mysli a duše
        </p>
      </div>

      {/* Overall Energy Circle */}
      <div className="flex justify-center mb-12">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={vibration.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(getOverallEnergy() / 10) * 553} 553`}
              className="transition-all duration-500"
            />
          </svg>
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{getOverallEnergy()}</span>
            <span className="text-sm text-gray-500">/ 10</span>
            <span className="text-xs mt-1" style={{ color: vibration.color }}>
              {vibration.text}
            </span>
          </div>
        </div>
      </div>

      {/* Energy Areas */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {areas.map((area) => (
          <div
            key={area.key}
            onClick={() => setSelectedArea(selectedArea === area.key ? null : area.key)}
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedArea === area.key 
                ? 'shadow-xl scale-105' 
                : 'shadow-lg hover:shadow-xl hover:scale-102'
            }`}
            style={{ backgroundColor: area.color + '20' }}
          >
            {/* Icon */}
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4"
              style={{ backgroundColor: area.color }}
            >
              {area.icon}
            </div>

            {/* Title */}
            <h4 className="text-xl font-bold text-gray-800 mb-1">{area.title}</h4>
            <p className="text-sm text-gray-500 mb-4">{area.subtitle}</p>

            {/* Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Energie</span>
                <span className="font-bold" style={{ color: area.color }}>
                  {energyLevels[area.key]}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevels[area.key]}
                onChange={(e) => handleSliderChange(area.key, parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${area.color} 0%, ${area.color} ${(energyLevels[area.key] / 10) * 100}%, #E5E7EB ${(energyLevels[area.key] / 10) * 100}%, #E5E7EB 100%)`,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Tips (expanded) */}
            {selectedArea === area.key && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                <p className="text-sm font-medium text-gray-700 mb-3">Tipy pro zvýšení energie:</p>
                <ul className="space-y-2">
                  {area.tips.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Energy Sources */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8">
        <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Zdroje energie
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { icon: <Sun className="w-6 h-6" />, label: 'Světlo', color: '#F59E0B' },
            { icon: <Moon className="w-6 h-6" />, label: 'Spánek', color: '#6366F1' },
            { icon: <Droplets className="w-6 h-6" />, label: 'Voda', color: '#3B82F6' },
            { icon: <Wind className="w-6 h-6" />, label: 'Dech', color: '#10B981' },
            { icon: <Hand className="w-6 h-6" />, label: 'Dotek', color: '#EC4899' },
          ].map((source, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: source.color + '20', color: source.color }}
              >
                {source.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{source.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vibration Message */}
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-700">
          Nízká nebo vysoká vibrace? <span className="font-bold" style={{ color: vibration.color }}>Co si vybereš?</span>
        </p>
        <p className="text-gray-500 mt-2">
          Své potřeby znej a naplňuj. A konstruktivně komunikuj.
        </p>
      </div>
    </div>
  );
};

export default EnergyTracker;
