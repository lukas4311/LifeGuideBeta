import React, { useState } from 'react';
import { Module } from '@/data/modules';
import { 
  ArrowLeft, 
  CheckCircle, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Play,
  Star
} from 'lucide-react';
import HandRules from './HandRules';

interface ModuleDetailProps {
  module: Module;
  onBack: () => void;
  progress: number;
  onProgressUpdate: (moduleId: number, progress: number) => void;
  completedExercises: number[];
  onExerciseComplete: (moduleId: number, exerciseIndex: number) => void;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ 
  module, 
  onBack, 
  progress,
  onProgressUpdate,
  completedExercises,
  onExerciseComplete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'affirmations'>('overview');
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [journalEntries, setJournalEntries] = useState<Record<number, string>>({});
  const [showAffirmationModal, setShowAffirmationModal] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const handleExerciseToggle = (index: number) => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };

  const handleJournalChange = (index: number, value: string) => {
    setJournalEntries(prev => ({ ...prev, [index]: value }));
  };

  const handleCompleteExercise = (index: number) => {
    if (!completedExercises.includes(index)) {
      onExerciseComplete(module.id, index);
      const newProgress = Math.round(((completedExercises.length + 1) / module.content.exercises.length) * 100);
      onProgressUpdate(module.id, Math.min(newProgress, 100));
    }
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % module.content.affirmations.length);
  };

  const prevAffirmation = () => {
    setCurrentAffirmation((prev) => (prev - 1 + module.content.affirmations.length) % module.content.affirmations.length);
  };

  const exerciseTypeIcons: Record<string, React.ReactNode> = {
    reflection: <BookOpen className="w-5 h-5" />,
    journal: <PenTool className="w-5 h-5" />,
    practice: <Play className="w-5 h-5" />,
    quiz: <Star className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: module.bgColor }}>
      {/* Header */}
      <div 
        className="sticky top-16 md:top-20 z-40 py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-sm"
        style={{ backgroundColor: module.bgColor + 'ee' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Zpět</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-bold" style={{ color: module.color }}>{progress}%</span> dokončeno
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: module.color }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-white text-3xl font-bold mb-6 shadow-lg"
            style={{ backgroundColor: module.color }}
          >
            {module.id}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            {module.title}
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-4" style={{ color: module.color }}>
            {module.subtitle}
          </p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {module.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Přehled', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'exercises', label: 'Cvičení', icon: <PenTool className="w-4 h-4" /> },
            { id: 'affirmations', label: 'Afirmace', icon: <Sparkles className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 bg-white/50 hover:bg-white'
              }`}
              style={{ backgroundColor: activeTab === tab.id ? module.color : undefined }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Intro */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {module.content.intro}
                </p>
              </div>

              {/* Special content for Module 2 - Hand Rules */}
              {module.id === 2 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Pravidla jedné ruky
                  </h3>
                  <HandRules />
                </div>
              )}

              {/* Key Points */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" style={{ color: module.color }} />
                  Klíčové body
                </h3>
                <div className="grid gap-3">
                  {module.content.keyPoints.map((point, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: module.bgColor }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: module.color }}
                      >
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Dokončeno {completedExercises.length} z {module.content.exercises.length} cvičení
                </p>
              </div>
              
              {module.content.exercises.map((exercise, index) => {
                const isCompleted = completedExercises.includes(index);
                const isExpanded = expandedExercise === index;
                
                return (
                  <div 
                    key={index}
                    className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                      isCompleted ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => handleExerciseToggle(index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isCompleted ? 'bg-green-500 text-white' : 'text-white'
                          }`}
                          style={{ backgroundColor: isCompleted ? undefined : module.color }}
                        >
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : exerciseTypeIcons[exercise.type]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{exercise.title}</h4>
                          <p className="text-sm text-gray-500 capitalize">{exercise.type}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 animate-fadeIn">
                        <p className="text-gray-700 mb-4">{exercise.description}</p>
                        
                        {exercise.type === 'journal' && (
                          <textarea
                            value={journalEntries[index] || ''}
                            onChange={(e) => handleJournalChange(index, e.target.value)}
                            placeholder="Zapiš své myšlenky..."
                            className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                          />
                        )}
                        
                        {exercise.type === 'reflection' && (
                          <textarea
                            value={journalEntries[index] || ''}
                            onChange={(e) => handleJournalChange(index, e.target.value)}
                            placeholder="Zamysli se a zapiš své poznatky..."
                            className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                          />
                        )}
                        
                        <button
                          onClick={() => handleCompleteExercise(index)}
                          disabled={isCompleted}
                          className={`mt-4 px-6 py-2 rounded-full font-medium transition-all ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'text-white hover:shadow-lg'
                          }`}
                          style={{ backgroundColor: isCompleted ? undefined : module.color }}
                        >
                          {isCompleted ? 'Dokončeno' : 'Označit jako dokončené'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Affirmations Tab */}
          {activeTab === 'affirmations' && (
            <div className="animate-fadeIn">
              {/* Featured Affirmation */}
              <div 
                className="text-center p-8 sm:p-12 rounded-2xl mb-8"
                style={{ backgroundColor: module.color + '15' }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-6" style={{ color: module.color }} />
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                  "{module.content.affirmations[currentAffirmation]}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={prevAffirmation}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-gray-500">
                    {currentAffirmation + 1} / {module.content.affirmations.length}
                  </span>
                  <button
                    onClick={nextAffirmation}
                    className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                </div>
              </div>

              {/* All Affirmations List */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">Všechny afirmace</h3>
              <div className="grid gap-3">
                {module.content.affirmations.map((affirmation, index) => (
                  <div 
                    key={index}
                    onClick={() => setCurrentAffirmation(index)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      currentAffirmation === index 
                        ? 'shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                    style={{ 
                      backgroundColor: currentAffirmation === index ? module.color + '20' : module.bgColor 
                    }}
                  >
                    <p className="text-gray-700 font-medium">"{affirmation}"</p>
                  </div>
                ))}
              </div>

              {/* Practice Button */}
              <button
                onClick={() => setShowAffirmationModal(true)}
                className="mt-8 w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
                style={{ backgroundColor: module.color }}
              >
                Začít praxi afirmací
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Affirmation Practice Modal */}
      {showAffirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center animate-fadeIn">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: module.color }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-4">
              Opakuj nahlas:
            </p>
            <p 
              className="text-xl font-medium mb-8 p-6 rounded-xl"
              style={{ backgroundColor: module.bgColor, color: module.color }}
            >
              "{module.content.affirmations[currentAffirmation]}"
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  nextAffirmation();
                }}
                className="flex-1 py-3 rounded-xl font-medium text-white"
                style={{ backgroundColor: module.color }}
              >
                Další afirmace
              </button>
              <button
                onClick={() => setShowAffirmationModal(false)}
                className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
