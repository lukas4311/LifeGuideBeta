
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <LanguageProvider>
        <AppLayout />
      </LanguageProvider>
    </AppProvider>
  );
};

export default Index;
