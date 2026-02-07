import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

interface QuizQuestion {
  question: string;
  musim: string;
  mohu: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Jak přistupuješ k práci?',
    musim: 'Musím jít do práce',
    mohu: 'Mohu jít do práce a přispět svým talentem',
  },
  {
    question: 'Jak vnímáš své povinnosti?',
    musim: 'Musím se starat o rodinu',
    mohu: 'Mohu se starat o ty, které miluji',
  },
  {
    question: 'Jak přistupuješ k výzvám?',
    musim: 'Musím to zvládnout',
    mohu: 'Mohu se z toho něco naučit',
  },
  {
    question: 'Jak vnímáš změny?',
    musim: 'Musím se změnit',
    mohu: 'Mohu růst a vyvíjet se',
  },
  {
    question: 'Jak přistupuješ k odpočinku?',
    musim: 'Nemůžu si odpočinout',
    mohu: 'Nemusím být pořád produktivní',
  },
];

const IdentityQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'musim' | 'mohu'>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: 'musim' | 'mohu') => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const getMohuCount = () => {
    return Object.values(answers).filter(a => a === 'mohu').length;
  };

  const getResultMessage = () => {
    const mohuCount = getMohuCount();
    const percentage = (mohuCount / quizQuestions.length) * 100;
    
    if (percentage >= 80) {
      return {
        title: 'Skvělé! Jsi na správné cestě!',
        message: 'Tvé myšlení je převážně v režimu "mohu". Pokračuj v tomto přístupu a inspiruj ostatní.',
        color: '#22C55E',
      };
    } else if (percentage >= 50) {
      return {
        title: 'Dobrý začátek!',
        message: 'Máš potenciál přejít více do režimu "mohu". Vědomě si všímej svých myšlenek.',
        color: '#F59E0B',
      };
    } else {
      return {
        title: 'Čas na transformaci!',
        message: 'Je čas vrátit se k "nemusím" a "mohu". Každý den si připomínej, že máš volbu.',
        color: '#7B68BE',
      };
    }
  };

  if (showResults) {
    const result = getResultMessage();
    const mohuCount = getMohuCount();
    
    return (
      <div className="max-w-xl mx-auto text-center animate-fadeIn">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: result.color }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{result.title}</h3>
        <p className="text-gray-600 mb-8">{result.message}</p>
        
        {/* Score */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="text-4xl font-bold mb-2" style={{ color: result.color }}>
            {mohuCount} / {quizQuestions.length}
          </div>
          <p className="text-gray-500">odpovědí v režimu "mohu"</p>
        </div>

        {/* Answer Summary */}
        <div className="space-y-3 mb-8">
          {quizQuestions.map((q, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl text-left ${
                answers[index] === 'mohu' ? 'bg-green-50' : 'bg-purple-50'
              }`}
            >
              <p className="text-sm text-gray-500 mb-1">{q.question}</p>
              <p className={`font-medium ${
                answers[index] === 'mohu' ? 'text-green-700' : 'text-purple-700'
              }`}>
                {answers[index] === 'mohu' ? q.mohu : q.musim}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Zkusit znovu
        </button>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            Otázka {currentQuestion + 1} z {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8 animate-fadeIn" key={currentQuestion}>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {question.question}
        </h3>
        <p className="text-gray-500">Vyber odpověď, která ti je bližší</p>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        <button
          onClick={() => handleAnswer('musim')}
          className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
            answers[currentQuestion] === 'musim'
              ? 'bg-purple-100 border-2 border-purple-500'
              : 'bg-gray-50 border-2 border-transparent hover:bg-purple-50 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              answers[currentQuestion] === 'musim'
                ? 'border-purple-500 bg-purple-500'
                : 'border-gray-300'
            }`}>
              {answers[currentQuestion] === 'musim' && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-medium text-gray-800">{question.musim}</span>
          </div>
        </button>

        <button
          onClick={() => handleAnswer('mohu')}
          className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
            answers[currentQuestion] === 'mohu'
              ? 'bg-green-100 border-2 border-green-500'
              : 'bg-gray-50 border-2 border-transparent hover:bg-green-50 hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              answers[currentQuestion] === 'mohu'
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {answers[currentQuestion] === 'mohu' && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-medium text-gray-800">{question.mohu}</span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            currentQuestion === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Zpět
        </button>
        
        {answers[currentQuestion] && currentQuestion < quizQuestions.length - 1 && (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Další
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default IdentityQuiz;
