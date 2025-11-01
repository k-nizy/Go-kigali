import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Globe, Save, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Load profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (lang) => {
    setProfile(prev => ({
      ...prev,
      language: lang
    }));
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Save to localStorage (or send to API)
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast.success(t('profile.saved'));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg">
                {t('profile.title')}
              </h1>
              <p className="text-white/90 text-lg">
                Manage your account and preferences
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/user-profile.svg" 
                alt="User Profile" 
                className="w-64 h-64 mx-auto drop-shadow-xl animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {t('profile.personalInfo')}
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('profile.name')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('profile.email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="input pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('profile.phone')}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="+250 7XX XXX XXX"
                      className="input pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    {t('profile.language')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange('en')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        profile.language === 'en'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {t('profile.languages.en')}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange('rw')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        profile.language === 'rw'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {t('profile.languages.rw')}
                      </p>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>{loading ? t('common.loading') : t('profile.save')}</span>
                </button>
              </form>
            </div>

            {/* Trip History */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('profile.tripHistory')}
              </h2>
              
              {trips.length > 0 ? (
                <div className="space-y-3">
                  {trips.map((trip, index) => (
                    <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {trip.destination}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {trip.fare} RWF
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span>{trip.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {t('profile.noTrips')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('profile.settings')}
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300">
                  {t('profile.notifications')}
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300">
                  {t('profile.privacy')}
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('profile.about')}
              </h3>
              <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-medium">Web</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
