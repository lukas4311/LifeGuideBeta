import React from 'react';
import { Compass, Menu, X, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  activeModule: number | null;
  setActiveModule: (id: number | null) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  user: SupabaseUser | null;
  onSignInClick: () => void;
  onSignOut: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeModule, 
  setActiveModule, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  user,
  onSignInClick,
  onSignOut,
  isAdmin = false,
  onAdminClick
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems = [
    { id: null, label: 'Domů' },
    { id: 1, label: 'Identita' },
    { id: 2, label: 'Pravidla' },
    { id: 3, label: 'Navigace' },
    { id: 4, label: 'Energie' },
    { id: 5, label: 'Vztahy' },
  ];

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Uživatel';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">ŘIDIČÁK NA ŽIVOT</h1>
              <p className="text-xs text-purple-600 -mt-1">Bez kompromisů</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id ?? 'home'}
                onClick={() => setActiveModule(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeModule === item.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth & CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {getUserDisplayName()}
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800 truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {isAdmin && onAdminClick && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onAdminClick();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Odhlásit se
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full font-semibold text-sm hover:bg-purple-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Přihlásit se
              </button>
            )}
            
            <a 
              href="https://www.veranekvindova.cz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 rounded-full font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Kontaktujte mě
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {/* User Info (Mobile) */}
            {user && (
              <div className="px-4 py-3 mb-2 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{getUserDisplayName()}</p>
                      {isAdmin && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id ?? 'home'}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
                    activeModule === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {user ? (
                <>
                  {isAdmin && onAdminClick && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onAdminClick();
                      }}
                      className="mt-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="mt-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Odhlásit se
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignInClick();
                  }}
                  className="mt-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Přihlásit se
                </button>
              )}
              
              <a 
                href="https://www.veranekvindova.cz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 rounded-lg font-semibold text-center"
              >
                Kontaktujte mě
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
