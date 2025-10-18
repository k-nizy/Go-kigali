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
                className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KG</span>
                </div>
                <span className="font-heading font-bold text-xl text-neutral-900 dark:text-white">
                  {t('app.name')}
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
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

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors"
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
                </button>

                {/* Language dropdown */}
                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-800 rounded-lg shadow-medium border border-neutral-200 dark:border-neutral-700 z-50">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                        i18n.language === 'en' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('rw')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                        i18n.language === 'rw' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Kinyarwanda
                    </button>
                  </div>
                )}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 shadow-strong">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
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
