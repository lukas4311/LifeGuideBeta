import React, { useState, useEffect } from 'react';
import { modules } from '@/data/modules';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Header from './coaching/Header';
import Hero from './coaching/Hero';
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
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const location = useLocation();

  // keep activeModule in sync with query parameter when user navigates via router links
  useEffect(() => {
    if (location.pathname === '/ModuleDetailLegacy') {
      const params = new URLSearchParams(location.search);
      const moduleParam = params.get('module');
      if (moduleParam) {
        setActiveModule(Number(moduleParam));
        return;
      }
    }

    // reset when returning to root or other pages
    if (location.pathname === '/') {
      setActiveModule(null);
    }
  }, [location]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  });
  const [completedExercises, setCompletedExercises] = useState<Record<number, number[]>>({
    1: [], 2: [], 3: [], 4: [], 5: [],
  });
  const [showProgressSidebar, setShowProgressSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // ✅ FIXED: Auth check BEZ signOut deadlocku
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      // Admin check
      if (session?.user) {
        try {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          setIsAdmin(!!adminData);
        } catch (error) {
          console.warn('Admin check failed:', error);
        }
      }
      
      setLoadingAuth(false);
    };

    checkSession();

    // ✅ FIXED: Auth listener s timeoutem proti deadlocku
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Odložený admin check
        setTimeout(async () => {
          try {
            const { data: adminData } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            setIsAdmin(!!adminData);
          } catch (error) {
            console.warn('Admin check failed:', error);
          }
        }, 100);
      } else {
        setIsAdmin(false);
        setShowAdminDashboard(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ FIXED: Progress load – pouze při změně user.id
  useEffect(() => {
    const loadProgress = async () => {
      if (loadingAuth) return;

      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .order('module_id, lesson_key');

          if (error) throw error;

          if (data?.length) {
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
          console.error('Progress load error:', err);
        }
      } else {
        // LocalStorage fallback
        const savedProgress = localStorage.getItem('moduleProgress');
        const savedExercises = localStorage.getItem('completedExercises');
        
        if (savedProgress) setModuleProgress(JSON.parse(savedProgress));
        if (savedExercises) setCompletedExercises(JSON.parse(savedExercises));
      }
    };

    loadProgress();
  }, [user?.id, loadingAuth]);

  // ✅ FIXED: Save progress
  const saveProgress = async (newProgress: Record<number, number>, newExercises: Record<number, number[]>) => {
    if (user?.id) {
      try {
        for (const moduleId of [1, 2, 3, 4, 5]) {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              module_id: moduleId,
              progress: newProgress[moduleId] || 0,
              completed_exercises: newExercises[moduleId] || [],
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,module_id' });
        }
      } catch (err) {
        console.error('Save progress error:', err);
      }
    } else {
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

  // ✅ FIXED: Hard signOut bez deadlocku
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out warning:', error);
    } finally {
      // Hard reset
      setUser(null);
      setIsAdmin(false);
      setShowAdminDashboard(false);
      
      // LocalStorage fallback
      const savedProgress = localStorage.getItem('moduleProgress');
      const savedExercises = localStorage.getItem('completedExercises');
      
      setModuleProgress(savedProgress ? JSON.parse(savedProgress) : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      setCompletedExercises(savedExercises ? JSON.parse(savedExercises) : { 1: [], 2: [], 3: [], 4: [], 5: [] });
      
      window.location.href = '/';
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const isRootPath = location.pathname === '/';

  const currentModule = activeModule ? modules.find(m => m.id === activeModule) : null;

  // Admin dashboard
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
          <>
            {isRootPath && <Hero onStartJourney={handleStartJourney} />}
            {/* render whatever route is active */}
            <Outlet />
            {isRootPath && <Testimonials />}
            {isRootPath && <ContactSection />}
          </>
        ) : currentModule ? (
          <div className="relative">
            <ModuleDetail 
              module={currentModule}
              onBack={handleBack}
              progress={moduleProgress[currentModule.id] || 0}
              onProgressUpdate={handleProgressUpdate}
              completedExercises={completedExercises[currentModule.id] || []}
              onExerciseComplete={handleExerciseComplete}
            />

            {/* Module-specific content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: currentModule.bgColor }}>
              {currentModule.id === 1 && <IdentityQuiz />}
              {currentModule.id === 3 && <MindsetComparison />}
              {currentModule.id === 4 && <EnergyTracker />}
              {currentModule.id === 5 && <GratitudeJournal user={user} />}
            </div>

            {/* Navigation */}
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

      <Footer />

      {/* Progress Sidebar */}
      {/* {showProgressSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowProgressSidebar(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto">
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
      )} */}

      {/* Progress Toggle */}
      {/* <button
        onClick={() => setShowProgressSidebar(!showProgressSidebar)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button> */}
    </div>
  );
};

export default AppLayout;
