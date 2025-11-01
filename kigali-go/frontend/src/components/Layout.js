import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Navigation, 
  AlertTriangle, 
  User,
  Menu,
  X,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/map', icon: Map, label: t('navigation.map') },
    { path: '/plan', icon: Navigation, label: t('navigation.plan') },
    { path: '/reports', icon: AlertTriangle, label: t('navigation.reports') },
    { path: '/profile', icon: User, label: t('navigation.profile') },
  ];

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 shadow-soft border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {t('app.name')}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 -mt-1">
                    Smart City Transport
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon size={18} className={`${isActive(item.path) ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                >
                  <Globe size={18} className="text-neutral-600 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{i18n.language.toUpperCase()}</span>
                </button>

                {/* Language dropdown */}
                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden animate-slide-down">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all ${
                        i18n.language === 'en' 
                          ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 dark:from-blue-900/30 dark:to-green-900/30 dark:text-blue-400 border-l-4 border-blue-500' 
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('rw')}
                      className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all ${
                        i18n.language === 'rw' 
                          ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 dark:from-blue-900/30 dark:to-green-900/30 dark:text-blue-400 border-l-4 border-blue-500' 
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      🇷🇼 Kinyarwanda
                    </button>
                  </div>
                )}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun size={18} className="text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Moon size={18} className="text-neutral-600 group-hover:text-blue-600 group-hover:-rotate-12 transition-all duration-300" />
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-neutral-600 dark:text-neutral-300" />
                ) : (
                  <Menu size={20} className="text-neutral-600 dark:text-neutral-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-700">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-primary-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-700 shadow-2xl z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200"
              >
                <div className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`}>
                  <div className={`relative ${
                    active 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-xl shadow-md' 
                      : 'text-neutral-500 dark:text-neutral-400 p-2'
                  }`}>
                    <Icon size={20} />
                    {active && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile content padding */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Layout;
