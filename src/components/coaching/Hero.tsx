import React from 'react';
import { ChevronDown, Sparkles, Heart, Star } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating Icons */}
      <div className="absolute top-32 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-8 h-8 text-yellow-400/60" />
      </div>
      <div className="absolute top-48 right-1/3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Heart className="w-6 h-6 text-pink-400/60" />
      </div>
      <div className="absolute bottom-40 left-1/3 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <Star className="w-7 h-7 text-purple-400/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-600">Unikátní seberozvojový program</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            ŘIDIČÁK NA ŽIVOT
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-4 font-light">
          Pro váš spokojený život
        </p>
        <p className="text-lg sm:text-xl text-purple-600 font-semibold mb-8">
          Bez kompromisů
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-12 leading-relaxed">
          Objevte pět klíčových modulů, které vás provedou cestou k autentickému, 
          naplněnému a šťastnému životu. Vzpomeňte si, kdo opravdu jste.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartJourney}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Začít cestu
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
          <button
            onClick={() => {
              const modulesSection = document.getElementById('modules');
              modulesSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-semibold text-lg shadow-md hover:shadow-lg hover:bg-white transition-all duration-300"
          >
            Prozkoumat moduly
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-500">Modulů</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-pink-500">15+</div>
            <div className="text-sm text-gray-500">Cvičení</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-500">30+</div>
            <div className="text-sm text-gray-500">Afirmací</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
