import React from 'react';
import { modules } from '@/data/modules';
import { CheckCircle, Circle, User, Hand, Compass, Zap, Heart } from 'lucide-react';

interface ProgressTrackerProps {
  moduleProgress: Record<number, number>;
  currentModule: number | null;
  onModuleClick: (id: number) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  identity: <User className="w-5 h-5" />,
  hand: <Hand className="w-5 h-5" />,
  compass: <Compass className="w-5 h-5" />,
  energy: <Zap className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  moduleProgress, 
  currentModule,
  onModuleClick 
}) => {
  const totalProgress = Object.values(moduleProgress).reduce((sum, p) => sum + p, 0) / modules.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Tvůj pokrok</h3>
        <div className="text-sm">
          <span className="font-bold text-purple-600">{Math.round(totalProgress)}%</span>
          <span className="text-gray-500 ml-1">celkem</span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* Journey Path */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
        
        {/* Module Steps */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const progress = moduleProgress[module.id] || 0;
            const isComplete = progress === 100;
            const isActive = currentModule === module.id;
            const isStarted = progress > 0;

            return (
              <div 
                key={module.id}
                onClick={() => onModuleClick(module.id)}
                className={`relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-50 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Step Indicator */}
                <div 
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isComplete 
                      ? 'bg-green-500 text-white' 
                      : isStarted 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: isComplete ? undefined : isStarted ? module.color : undefined 
                  }}
                >
                  {isComplete ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    iconMap[module.icon]
                  )}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold truncate ${isActive ? 'text-purple-700' : 'text-gray-800'}`}>
                      {module.title}
                    </h4>
                    <span 
                      className="text-sm font-medium ml-2"
                      style={{ color: module.color }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{module.subtitle}</p>
                  
                  {/* Mini Progress Bar */}
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: module.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {totalProgress === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center">
          <p className="text-green-700 font-bold">
            Gratulujeme! Dokončil/a jsi všechny moduly!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
