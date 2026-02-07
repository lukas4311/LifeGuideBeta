import React, { useState, useEffect } from 'react';
import { modules } from '@/data/modules';
import { Target, Brain, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Header from './coaching/Header';
import Hero from './coaching/Hero';
import ModulesSection from './coaching/ModulesSection';
import ModuleDetail from './coaching/ModuleDetail';
import ProgressTracker from './coaching/ProgressTracker';
import Testimonials from './coaching/Testimonials';
import ContactSection from './coaching/ContactSection';
import Footer from './coaching/Footer';
import IdentityQuiz from './coaching/IdentityQuiz';
import MindsetComparison from './coaching/MindsetComparison';
import EnergyTracker from './coaching/EnergyTracker';
import GratitudeJournal from './coaching/GratitudeJournal';
import AuthModal from './coaching/AuthModal';
import AdminDashboard from './admin/AdminDashboard';

const AppLayout: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [completedExercises, setCompletedExercises] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  const [showProgressSidebar, setShowProgressSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
      
      setLoadingAuth(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // Check admin status on auth change
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      } else {
        setIsAdmin(false);
        setShowAdminDashboard(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          if (data && data.length > 0) {
            const progress: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const exercises: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

            data.forEach((item) => {
              progress[item.module_id] = item.progress || 0;
              exercises[item.module_id] = item.completed_exercises || [];
            });

            setModuleProgress(progress);
            setCompletedExercises(exercises);
          }
        } catch (err) {
          console.error('Error loading progress:', err);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedProgress = localStorage.getItem('moduleProgress');
        const savedExercises = localStorage.getItem('completedExercises');
        
        if (savedProgress) {
          setModuleProgress(JSON.parse(savedProgress));
        }
        if (savedExercises) {
          setCompletedExercises(JSON.parse(savedExercises));
        }
      }
    };

    if (!loadingAuth) {
      loadProgress();
    }
  }, [user, loadingAuth]);

  // Save progress to database or localStorage
  const saveProgress = async (newProgress: Record<number, number>, newExercises: Record<number, number[]>) => {
    if (user) {
      try {
        // Upsert progress for each module
        for (const moduleId of [1, 2, 3, 4, 5]) {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              module_id: moduleId,
              progress: newProgress[moduleId] || 0,
              completed_exercises: newExercises[moduleId] || [],
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,module_id'
            });
        }
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('moduleProgress', JSON.stringify(newProgress));
      localStorage.setItem('completedExercises', JSON.stringify(newExercises));
    }
  };

  const handleProgressUpdate = (moduleId: number, progress: number) => {
    const newProgress = { ...moduleProgress, [moduleId]: progress };
    setModuleProgress(newProgress);
    saveProgress(newProgress, completedExercises);
  };

  const handleExerciseComplete = (moduleId: number, exerciseIndex: number) => {
    const newExercises = {
      ...completedExercises,
      [moduleId]: [...(completedExercises[moduleId] || []), exerciseIndex],
    };
    setCompletedExercises(newExercises);
    saveProgress(moduleProgress, newExercises);
  };

  const handleStartJourney = () => {
    setActiveModule(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModuleClick = (id: number) => {
    setActiveModule(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Reset to localStorage data
    const savedProgress = localStorage.getItem('moduleProgress');
    const savedExercises = localStorage.getItem('completedExercises');
    
    if (savedProgress) {
      setModuleProgress(JSON.parse(savedProgress));
    } else {
      setModuleProgress({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    }
    if (savedExercises) {
      setCompletedExercises(JSON.parse(savedExercises));
    } else {
      setCompletedExercises({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    }
  };

  const handleAuthSuccess = () => {
    // Progress will be loaded automatically via useEffect
  };

  // Get the active module data
  const currentModule = activeModule ? modules.find(m => m.id === activeModule) : null;

  // Show admin dashboard if admin is viewing it
  if (showAdminDashboard && isAdmin && user) {
    return (
      <AdminDashboard 
        user={user} 
        onBack={() => setShowAdminDashboard(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        activeModule={activeModule}
        setActiveModule={(id) => {
          setActiveModule(id);
          setShowAdminDashboard(false);
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        onSignInClick={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
        onAdminClick={() => setShowAdminDashboard(true)}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />


      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {activeModule === null ? (
          // Home Page
          <>
            <Hero onStartJourney={handleStartJourney} />
            
            {/* Modules Section */}
            <ModulesSection 
              moduleProgress={moduleProgress}
              activeModule={activeModule}
              onModuleClick={handleModuleClick}
            />

            {/* Interactive Tools Preview */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-teal-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Interaktivní nástroje
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Vyzkoušejte některé z našich transformačních nástrojů
                  </p>
                </div>

                {/* Tool Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div 
                    onClick={() => handleModuleClick(1)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Target className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz: Musím vs. Mohu</h3>
                    <p className="text-gray-600">Zjisti, jak moc jsi v režimu "mohu" a transformuj své myšlení.</p>
                  </div>

                  <div 
                    onClick={() => handleModuleClick(3)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-7 h-7 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Poor vs. Rich Mindset</h3>
                    <p className="text-gray-600">Porovnej a transformuj své myšlenky z chudého na bohatý mindset.</p>
                  </div>

                  <div 
                    onClick={() => handleModuleClick(4)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Energetický audit</h3>
                    <p className="text-gray-600">Ohodnoť svou energii v oblasti těla, mysli a duše.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Testimonials */}
            <Testimonials />

            {/* Contact Section */}
            <ContactSection />
          </>
        ) : currentModule ? (
          // Module Detail Page
          <div className="relative">
            <ModuleDetail 
              module={currentModule}
              onBack={handleBack}
              progress={moduleProgress[currentModule.id] || 0}
              onProgressUpdate={handleProgressUpdate}
              completedExercises={completedExercises[currentModule.id] || []}
              onExerciseComplete={handleExerciseComplete}
            />

            {/* Special Interactive Content for Each Module */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: currentModule.bgColor }}>
              {currentModule.id === 1 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Quiz: Musím vs. Mohu
                  </h3>
                  <IdentityQuiz />
                </div>
              )}

              {currentModule.id === 3 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <MindsetComparison />
                </div>
              )}

              {currentModule.id === 4 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <EnergyTracker />
                </div>
              )}

              {currentModule.id === 5 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <GratitudeJournal user={user} />
                </div>
              )}
            </div>

            {/* Navigation to Next/Previous Module */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" style={{ backgroundColor: currentModule.bgColor }}>
              <div className="flex justify-between items-center">
                {currentModule.id > 1 && (
                  <button
                    onClick={() => handleModuleClick(currentModule.id - 1)}
                    className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
                  >
                    ← Předchozí modul
                  </button>
                )}
                {currentModule.id < 5 && (
                  <button
                    onClick={() => handleModuleClick(currentModule.id + 1)}
                    className="ml-auto px-6 py-3 text-white rounded-full shadow-md hover:shadow-lg transition-all font-medium"
                    style={{ backgroundColor: currentModule.color }}
                  >
                    Další modul →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <Footer />

      {/* Progress Sidebar Toggle (Fixed) */}
      <button
        onClick={() => setShowProgressSidebar(!showProgressSidebar)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Progress Sidebar */}
      {showProgressSidebar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowProgressSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Tvůj pokrok</h2>
                <button
                  onClick={() => setShowProgressSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Sync Status */}
              {user ? (
                <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pokrok je synchronizován s vaším účtem
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                  <p className="font-medium mb-1">Pokrok je uložen pouze lokálně</p>
                  <button
                    onClick={() => {
                      setShowProgressSidebar(false);
                      setShowAuthModal(true);
                    }}
                    className="text-purple-600 font-medium hover:text-purple-700"
                  >
                    Přihlaste se pro synchronizaci
                  </button>
                </div>
              )}
              
              <ProgressTracker 
                moduleProgress={moduleProgress}
                currentModule={activeModule}
                onModuleClick={(id) => {
                  handleModuleClick(id);
                  setShowProgressSidebar(false);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppLayout;
