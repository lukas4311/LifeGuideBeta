import React from 'react';
import { ChevronDown, Sparkles, Heart, Star } from 'lucide-react';
import HeroSection from '../HeroSection';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <HeroSection />
  );
};

export default Hero;
