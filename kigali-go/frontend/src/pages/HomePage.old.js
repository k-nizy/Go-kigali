import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  Map, 
  Calculator, 
  AlertTriangle,
  Bus,
  Car,
  Bike,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    zones: 0,
    trips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/statistics');
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Navigation,
      title: t('home.quickActions.planTrip'),
      description: 'Find the best route',
      action: () => navigate('/plan'),
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      icon: Map,
      title: t('home.quickActions.viewMap'),
      description: 'See live transport',
      action: () => navigate('/map'),
      color: 'bg-accent-500 hover:bg-accent-600'
    },
    {
      icon: Calculator,
      title: t('home.quickActions.estimateFare'),
      description: 'Calculate costs',
      action: () => navigate('/fare-estimator'),
      color: 'bg-secondary-500 hover:bg-secondary-600'
    },
    {
      icon: AlertTriangle,
      title: t('home.quickActions.reportIssue'),
      description: 'Report problems',
      action: () => navigate('/reports'),
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: t('home.features.realtime.title'),
      description: t('home.features.realtime.description'),
      color: 'text-primary-500'
    },
    {
      icon: TrendingUp,
      title: t('home.features.fares.title'),
      description: t('home.features.fares.description'),
      color: 'text-accent-500'
    },
    {
      icon: Navigation,
      title: t('home.features.routes.title'),
      description: t('home.features.routes.description'),
      color: 'text-secondary-500'
    },
    {
      icon: Shield,
      title: t('home.features.safety.title'),
      description: t('home.features.safety.description'),
      color: 'text-green-500'
    }
  ];

  const transportModes = [
    {
      icon: Bus,
      title: 'Bus (Tap&Go)',
      description: 'Public transport with contactless payment',
      color: 'bg-bus'
    },
    {
      icon: Bike,
      title: 'Motorcycle Taxi',
      description: 'Quick and affordable rides around the city',
      color: 'bg-moto'
    },
    {
      icon: Car,
      title: 'Taxi',
      description: 'Comfortable rides for longer distances',
      color: 'bg-taxi'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-green-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url(/images/kigali-pattern.svg)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-300/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Live Transport Tracking
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
                  {t('home.welcome')}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                  {t('home.subtitle')}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="relative z-10">
                        <div className={`${action.color.replace('hover:', '').replace('bg-', 'text-')} mb-3`}>
                          <Icon size={32} className="mx-auto" />
                        </div>
                        <h3 className="font-bold text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    </button>
                  );
                })}
              </div>
              
              {/* Stats Preview */}
              <div className="flex items-center space-x-6 pt-6">
                <div className="text-white">
                  <div className="text-3xl font-bold">{loading ? '...' : (stats?.vehicles || 0).toLocaleString()}</div>
                  <div className="text-sm text-white/80">Active Vehicles</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-white">
                  <div className="text-3xl font-bold">{loading ? '...' : (stats?.zones || 0).toLocaleString()}</div>
                  <div className="text-sm text-white/80">Service Zones</div>
                </div>
              </div>
            </div>
            
            {/* Right side - Hero illustration */}
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
              <img 
                src="/images/hero-illustration.svg" 
                alt="Kigali Transport" 
                className="relative w-full h-auto drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-neutral-900 dark:text-white">
              {t('home.stats.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">Real-time data from our transport network</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Vehicles Stat */}
            <div className="group bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-blue-200 dark:hover:border-blue-800">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bus className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                    {loading ? '...' : (stats?.vehicles || 0).toLocaleString()}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 font-semibold">{t('home.stats.vehicles')}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Active on roads</p>
                </div>
              </div>
            </div>
            
            {/* Zones Stat */}
            <div className="group bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-green-200 dark:hover:border-green-800">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                    {loading ? '...' : (stats?.zones || 0).toLocaleString()}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 font-semibold">{t('home.stats.zones')}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Coverage areas</p>
                </div>
              </div>
            </div>
            
            {/* Trips Stat */}
            <div className="group bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-purple-200 dark:hover:border-purple-800">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">
                    {loading ? '...' : (stats?.trips || 0).toLocaleString()}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 font-semibold">{t('home.stats.trips')}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Completed today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-4 text-neutral-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          <p className="text-center text-neutral-600 dark:text-neutral-300 mb-12 max-w-2xl mx-auto">
            Everything you need for a seamless transport experience in Kigali
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-start space-x-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex-shrink-0">
                <img src="/images/route-planning.svg" alt="Route Planning" className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  {t('home.features.routes.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t('home.features.routes.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex-shrink-0">
                <img src="/images/fare-calculator.svg" alt="Fare Calculator" className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  {t('home.features.fares.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t('home.features.fares.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex-shrink-0">
                <img src="/images/map-illustration.svg" alt="Real-time Tracking" className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  {t('home.features.realtime.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t('home.features.realtime.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex-shrink-0">
                <img src="/images/safety-illustration.svg" alt="Safety First" className="w-32 h-32" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  {t('home.features.safety.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t('home.features.safety.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transport Modes Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-neutral-900 dark:text-white">
              Available Transport Modes
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Choose from multiple transport options to get around Kigali efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bus Card */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 dark:border-neutral-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-full h-48 mb-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl overflow-hidden">
                  <img 
                    src="/images/transport-bus.svg" 
                    alt="Bus" 
                    className="w-4/5 h-4/5 object-contain transform group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2"%3E%3Crect x="3" y="6" width="18" height="11" rx="2"/%3E%3Cpath d="M3 12h18M7 6v6M17 6v6M7 17h.01M17 17h.01"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Bus (Tap&Go)
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Public transport with contactless payment system for quick and easy commuting
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Starting at</span>
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-bold shadow-md">
                      500 RWF
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Motorcycle Card */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 dark:border-neutral-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-full h-48 mb-6 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl overflow-hidden">
                  <img 
                    src="/images/transport-moto.svg" 
                    alt="Motorcycle" 
                    className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Motorcycle Taxi
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Quick and affordable rides around the city, perfect for beating traffic
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Starting at</span>
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-sm font-bold shadow-md">
                      800 RWF
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Taxi Card */}
            <div className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 dark:border-neutral-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-full h-48 mb-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl overflow-hidden">
                  <img 
                    src="/images/transport-taxi.svg" 
                    alt="Taxi" 
                    className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Taxi
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                    Comfortable rides for longer distances with air conditioning and luggage space
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Starting at</span>
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-bold shadow-md">
                      2000 RWF
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'url(/images/kigali-pattern.svg)', 
            backgroundSize: 'cover' 
          }}></div>
        </div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Join thousands of daily commuters
            </div>
            
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Ready to explore Kigali?
            </h2>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience seamless transportation across Rwanda's capital city with real-time tracking, fare estimates, and route planning
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/plan')}
                className="group relative bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Navigation size={20} />
                  <span>Plan Your Trip</span>
                </span>
              </button>
              
              <button
                onClick={() => navigate('/map')}
                className="group relative bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Map size={20} />
                  <span>View Live Map</span>
                </span>
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>Safe & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>Best Fares</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
