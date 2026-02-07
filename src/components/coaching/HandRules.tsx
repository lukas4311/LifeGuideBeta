import React, { useState } from 'react';
import { fingerRules } from '@/data/modules';
import { X } from 'lucide-react';

const HandRules: React.FC = () => {
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null);
  const [hoveredFinger, setHoveredFinger] = useState<number | null>(null);

  const fingerPositions = [
    { top: '45%', left: '8%', rotate: '-15deg' },   // Palec
    { top: '5%', left: '28%', rotate: '-5deg' },    // Ukazováček
    { top: '0%', left: '45%', rotate: '0deg' },     // Prostředníček
    { top: '5%', left: '62%', rotate: '5deg' },     // Prsteníček
    { top: '20%', left: '78%', rotate: '10deg' },   // Malíček
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Hand SVG Container */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {/* Hand Base */}
        <svg viewBox="0 0 400 500" className="w-full h-full">
          {/* Palm */}
          <ellipse cx="200" cy="350" rx="120" ry="130" fill="#FFDAB9" stroke="#E8C4A0" strokeWidth="2" />
          
          {/* Fingers */}
          {fingerPositions.map((pos, index) => {
            const isActive = hoveredFinger === index || selectedFinger === index;
            const rule = fingerRules[index];
            
            // Finger dimensions based on index
            const fingerHeights = [100, 130, 150, 140, 110];
            const fingerWidths = [45, 35, 35, 35, 30];
            const fingerX = [60, 115, 175, 235, 290];
            const fingerY = [280, 180, 150, 170, 210];
            
            return (
              <g key={index}>
                {/* Finger shape */}
                <rect
                  x={fingerX[index]}
                  y={fingerY[index]}
                  width={fingerWidths[index]}
                  height={fingerHeights[index]}
                  rx="20"
                  fill={isActive ? rule.color : '#FFDAB9'}
                  stroke={isActive ? rule.color : '#E8C4A0'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300"
                  style={{ 
                    filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                    transform: isActive ? 'translateY(-5px)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredFinger(index)}
                  onMouseLeave={() => setHoveredFinger(null)}
                  onClick={() => setSelectedFinger(selectedFinger === index ? null : index)}
                />
                {/* Finger tip */}
                <ellipse
                  cx={fingerX[index] + fingerWidths[index] / 2}
                  cy={fingerY[index]}
                  rx={fingerWidths[index] / 2}
                  ry="15"
                  fill={isActive ? rule.color : '#FFDAB9'}
                  stroke={isActive ? rule.color : '#E8C4A0'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredFinger(index)}
                  onMouseLeave={() => setHoveredFinger(null)}
                  onClick={() => setSelectedFinger(selectedFinger === index ? null : index)}
                />
              </g>
            );
          })}
          
          {/* Heart in palm */}
          <path
            d="M200 380 C180 360 150 360 150 390 C150 420 200 450 200 450 C200 450 250 420 250 390 C250 360 220 360 200 380"
            fill="#F4A89F"
            className="animate-pulse"
          />
        </svg>

        {/* Finger Labels */}
        {fingerRules.map((rule, index) => {
          const labelPositions = [
            { top: '55%', left: '-5%' },
            { top: '15%', left: '15%' },
            { top: '5%', left: '40%' },
            { top: '15%', left: '65%' },
            { top: '30%', left: '85%' },
          ];
          
          const isActive = hoveredFinger === index || selectedFinger === index;
          
          return (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300 ${
                isActive ? 'scale-110 z-10' : 'scale-100'
              }`}
              style={{
                top: labelPositions[index].top,
                left: labelPositions[index].left,
              }}
            >
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition-all ${
                  isActive ? 'text-white' : 'text-gray-700 bg-white/90'
                }`}
                style={{ backgroundColor: isActive ? rule.color : undefined }}
                onMouseEnter={() => setHoveredFinger(index)}
                onMouseLeave={() => setHoveredFinger(null)}
                onClick={() => setSelectedFinger(selectedFinger === index ? null : index)}
              >
                {rule.finger}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Finger Detail */}
      {selectedFinger !== null && (
        <div 
          className="mt-8 p-6 rounded-2xl shadow-lg animate-fadeIn relative"
          style={{ backgroundColor: fingerRules[selectedFinger].color + '20' }}
        >
          <button
            onClick={() => setSelectedFinger(null)}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div 
            className="inline-block px-4 py-1 rounded-full text-white font-bold mb-3"
            style={{ backgroundColor: fingerRules[selectedFinger].color }}
          >
            {fingerRules[selectedFinger].finger}
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-3">
            {fingerRules[selectedFinger].title}
          </h4>
          <p className="text-gray-700 text-lg leading-relaxed">
            {fingerRules[selectedFinger].description}
          </p>
        </div>
      )}

      {/* Instructions */}
      {selectedFinger === null && (
        <p className="text-center text-gray-500 mt-6 animate-pulse">
          Klikni na prst pro zobrazení pravidla
        </p>
      )}

      {/* All Rules Summary */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {fingerRules.map((rule, index) => (
          <div
            key={index}
            onClick={() => setSelectedFinger(index)}
            className="p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: rule.color + '20' }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2"
              style={{ backgroundColor: rule.color }}
            >
              {index + 1}
            </div>
            <h5 className="font-bold text-gray-800 text-sm mb-1">{rule.title}</h5>
            <p className="text-xs text-gray-600 line-clamp-2">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandRules;
