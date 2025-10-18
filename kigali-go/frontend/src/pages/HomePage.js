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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-900 dark:to-neutral-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 imigongo-bg opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gradient mb-6">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-6 rounded-2xl shadow-medium hover:shadow-strong transition-all duration-200 transform hover:-translate-y-1`}
                  >
                    <Icon size={32} className="mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-8 text-neutral-900 dark:text-white">
            {t('home.stats.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {loading ? '...' : stats.vehicles.toLocaleString()}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">{t('home.stats.vehicles')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {loading ? '...' : stats.zones.toLocaleString()}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">{t('home.stats.zones')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {loading ? '...' : stats.trips.toLocaleString()}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">{t('home.stats.trips')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-neutral-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${feature.color.replace('text-', 'bg-').replace('-500', '-100')} dark:bg-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transport Modes Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-neutral-900 dark:text-white">
            Available Transport Modes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transportModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <div key={index} className="card-hover p-8 text-center">
                  <div className={`w-20 h-20 ${mode.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                    {mode.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {mode.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">
            Ready to explore Kigali?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start planning your next trip with KigaliGo
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-200 transform hover:-translate-y-1"
          >
            Plan Your Trip
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
