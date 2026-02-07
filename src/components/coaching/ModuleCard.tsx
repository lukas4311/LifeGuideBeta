import React from 'react';
import { Module } from '@/data/modules';
import { User, Hand, Compass, Zap, Heart, ArrowRight, CheckCircle } from 'lucide-react';
interface ModuleCardProps {
  module: Module;
  progress: number;
  onClick: () => void;
  isActive: boolean;
}
const iconMap: Record<string, React.ReactNode> = {
  identity: <User className="w-8 h-8" />,
  hand: <Hand className="w-8 h-8" />,
  compass: <Compass className="w-8 h-8" />,
  energy: <Zap className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />
};
const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  progress,
  onClick,
  isActive
}) => {
  return <div onClick={onClick} className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl ${isActive ? 'ring-4 ring-purple-500 shadow-2xl scale-[1.02]' : 'shadow-lg'}`} style={{
    backgroundColor: module.bgColor
  }}>{/* Progress Bar Background */}<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
        <div className="h-full transition-all duration-500" style={{
        width: `${progress}%`,
        backgroundColor: module.color
      }} />
      </div>{/* Module Number Badge */}<div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" style={{
      backgroundColor: module.color
    }}>
        {module.id}
      </div>{/* Icon */}<div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300" style={{
      backgroundColor: module.color
    }}>
        {iconMap[module.icon]}
      </div>{/* Content */}<h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
        {module.title}
      </h3><p className="text-lg font-medium mb-3" style={{
      color: module.color
    }}>
        {module.subtitle}
      </p><p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {module.description}
      </p>{/* Key Points Preview */}<div className="space-y-1 mb-4">
        {module.content.keyPoints.slice(0, 2).map((point, index) => <div key={index} className="flex items-start gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{
          color: module.color
        }} />
            <span className="line-clamp-1">{point}</span>
          </div>)}
      </div>{/* Progress & CTA */}<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50">
        <div className="text-sm">
          <span className="font-semibold" style={{
          color: module.color
        }} data-mixed-content="true">{progress}%</span>
          <span className="text-gray-500 ml-1">dokončeno</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{
        color: module.color
      }}>
          <span>Otevřít</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>1</div>;
};
export default ModuleCard;