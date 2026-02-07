import React from 'react';
import { modules } from '@/data/modules';
import ModuleCard from './ModuleCard';

interface ModulesSectionProps {
  moduleProgress: Record<number, number>;
  activeModule: number | null;
  onModuleClick: (id: number) => void;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  moduleProgress,
  activeModule,
  onModuleClick,
}) => {
  return (
    <section id="modules" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <span className="text-purple-600 font-medium">5 transformačních modulů</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Tvá cesta k spokojenému životu
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Každý modul tě provede klíčovými oblastmi osobního růstu. 
            Postupuj vlastním tempem a objevuj svůj potenciál.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={moduleProgress[module.id] || 0}
              onClick={() => onModuleClick(module.id)}
              isActive={activeModule === module.id}
            />
          ))}
        </div>

        {/* Journey Path Visual */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 transform -translate-y-1/2" />
            
            {/* Module Dots */}
            <div className="relative flex justify-between">
              {modules.map((module, index) => {
                const progress = moduleProgress[module.id] || 0;
                const isComplete = progress === 100;
                
                return (
                  <div 
                    key={module.id}
                    className="flex flex-col items-center"
                  >
                    <button
                      onClick={() => onModuleClick(module.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-110 ${
                        isComplete 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : progress > 0 
                            ? 'text-white shadow-lg' 
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                      style={{ 
                        backgroundColor: !isComplete && progress > 0 ? module.color : undefined 
                      }}
                    >
                      {module.id}
                    </button>
                    <span className="mt-2 text-sm font-medium text-gray-600">
                      {module.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
