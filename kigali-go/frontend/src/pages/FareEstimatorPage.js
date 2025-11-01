import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Bus, Car, Bike, DollarSign, Clock, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FareEstimatorPage = () => {
  const { t } = useTranslation();
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mode, setMode] = useState('bus');
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);

  const modes = [
    { id: 'bus', name: t('fare.modes.bus'), icon: Bus, color: 'bg-bus' },
    { id: 'moto', name: t('fare.modes.moto'), icon: Bike, color: 'bg-moto' },
    { id: 'taxi', name: t('fare.modes.taxi'), icon: Car, color: 'bg-taxi' }
  ];

  const handleEstimate = async (e) => {
    e.preventDefault();

    if (!distance || !duration) {
      toast.error(t('errors.validation'));
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/fare/estimate?distance_km=${encodeURIComponent(distance)}&duration_minutes=${encodeURIComponent(duration)}&mode=${encodeURIComponent(mode)}`
      );

      if (response.ok) {
        const data = await response.json();
        setFare(data.fare);
        toast.success('Fare estimated successfully');
      } else {
        toast.error(t('errors.network'));
      }
    } catch (error) {
      console.error('Error estimating fare:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 py-12 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg">
                {t('fare.title')}
              </h1>
              <p className="text-white/90 text-lg">
                Calculate estimated fares for your journey across Kigali
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/fare-calculator.svg" 
                alt="Fare Calculator" 
                className="w-64 h-64 mx-auto drop-shadow-xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Calculate Fare
              </h2>
            </div>

            <form onSubmit={handleEstimate}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  {t('fare.distance')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="5.0"
                    className="w-full px-4 py-3 pl-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  {t('fare.duration')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-3 pl-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
                  {t('fare.mode')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {modes.map((modeOption) => {
                    const Icon = modeOption.icon;
                    return (
                      <button
                        key={modeOption.id}
                        type="button"
                        onClick={() => setMode(modeOption.id)}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          mode === modeOption.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                            : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                      >
                        <div className={`w-10 h-10 ${modeOption.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className={`text-xs font-medium ${
                          mode === modeOption.id
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-neutral-700 dark:text-neutral-200'
                        }`}>
                          {modeOption.id.toUpperCase()}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Calculator size={20} />
                <span>{loading ? t('common.loading') : t('fare.estimate')}</span>
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {loading ? (
              <div className="card">
                <div className="text-center py-12">
                  <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Calculating your fare...
                  </p>
                </div>
              </div>
            ) : fare ? (
              <>
                <div className="card bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 text-white shadow-2xl animate-scale-in">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2 uppercase tracking-wide">{t('fare.result.title')}</p>
                    <div className="text-6xl md:text-7xl font-bold mb-2 drop-shadow-lg">
                      {fare.total_fare?.toLocaleString() || 0}
                    </div>
                    <p className="text-xl opacity-90 font-semibold">{t('fare.result.currency')}</p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm opacity-80">
                        for {distance} km • {duration} min • {mode.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card animate-slide-up">
                  <h3 className="text-lg font-semibold mb-6 text-neutral-900 dark:text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Fare Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">{t('fare.result.baseFare')}</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {fare.base_fare?.toLocaleString() || 0} RWF
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">{t('fare.result.distanceCharge')}</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {fare.distance_fare?.toLocaleString() || 0} RWF
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-neutral-700 dark:text-neutral-300">{t('fare.result.timeCharge')}</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {fare.time_fare?.toLocaleString() || 0} RWF
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-neutral-200 dark:border-neutral-700">
                      <span className="text-xl font-bold text-neutral-900 dark:text-white">
                        {t('fare.result.total')}
                      </span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        {fare.total_fare?.toLocaleString() || 0} RWF
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-300 mb-2">
                    Enter trip details to estimate fare
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Fill in the distance, duration, and transport mode
                  </p>
                </div>
              </div>
            )}

            {/* Fare Factors Info */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('fare.factors.title')}
              </h3>
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 mt-0.5 text-accent-500" />
                  <span>{t('fare.factors.peakHours')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 mt-0.5 text-secondary-500" />
                  <span>{t('fare.factors.nightTime')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Navigation className="w-4 h-4 mt-0.5 text-primary-500" />
                  <span>{t('fare.factors.zone')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FareEstimatorPage;
