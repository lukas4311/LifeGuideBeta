  import React from 'react';
  import { motion } from 'framer-motion';
  import { Sparkles, ArrowRight } from 'lucide-react';
  import { Button } from "@/components/ui/button";
  import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
  import { useLanguage } from './LanguageContext';

  export default function HeroSection() {
    const { t } = useLanguage();

    return (
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-violet-50 to-rose-50" />
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl"
            animate={{ x: [0, 20, -20, 0], y: [0, -30, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-600">{t('welcomeSubtitle')}</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{t('welcomeSubtitle2')}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl h-20 font-bold bg-gradient-to-r from-amber-600 via-violet-600 to-rose-600 bg-clip-text text-transparent leading-tight mb-6"
          >
            {t('welcomeTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('welcomeDescription')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {/* scroll-only link to modules section on the home page */}
            <Link
              to="/#modules"
              onClick={() => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('modules');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Button size="lg" className="bg-gradient-to-r from-amber-500 via-violet-500 to-rose-500 hover:from-amber-600 hover:via-violet-600 hover:to-rose-600 text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                {t('startJourney')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {/* <Link to={createPageUrl('Modules')}>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-2xl border-2 hover:bg-white/60 transition-all duration-300">
                {t('exploreModules')}
              </Button>
            </Link> */}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-12"
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                5
              </div>
              <div className="text-sm text-gray-500 font-medium">{t('statsModules')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
                25
              </div>
              <div className="text-sm text-gray-500 font-medium">{t('statsExercises')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }