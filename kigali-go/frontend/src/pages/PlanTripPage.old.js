import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation, MapPin, Clock, DollarSign, Bus, Car, Bike } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PlanTripPage = () => {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  
  // Popular locations in Kigali with coordinates (from Kigali map)
  const popularLocations = [
    // Nyarugenge District
    { name: 'Nyabugogo', coords: '-1.9444,30.0444' },
    { name: 'City Center', coords: '-1.9536,30.0606' },
    { name: 'Nyamirambo', coords: '-1.9803,30.0514' },
    { name: 'Kigali Bus Station', coords: '-1.9536,30.0594' },
    { name: 'Muhima', coords: '-1.9622,30.0681' },
    { name: 'Biryogo', coords: '-1.9706,30.0431' },
    { name: 'Nyakabanda', coords: '-1.9753,30.0769' },
    
    // Gasabo District
    { name: 'Kimironko', coords: '-1.9307,30.1182' },
    { name: 'Remera', coords: '-1.9526,30.0953' },
    { name: 'Kacyiru', coords: '-1.9441,30.0619' },
    { name: 'Gikondo', coords: '-1.9889,30.0764' },
    { name: 'Kabeza', coords: '-1.9922,30.1036' },
    { name: 'Kanombe', coords: '-1.9711,30.1350' },
    { name: 'Kinyinya', coords: '-1.9208,30.1156' },
    { name: 'Gisozi', coords: '-1.9247,30.0906' },
    { name: 'Kagugu', coords: '-1.9111,30.1058' },
    { name: 'Kimihurura', coords: '-1.9389,30.1028' },
    { name: 'Nyarutarama', coords: '-1.9494,30.1181' },
    { name: 'Kigali Heights', coords: '-1.9367,30.1133' },
    
    // Kicukiro District
    { name: 'Kicukiro', coords: '-1.9706,30.1044' },
    { name: 'Gikondo Industrial', coords: '-1.9889,30.0764' },
    { name: 'Niboye', coords: '-2.0019,30.1250' },
    { name: 'Kagarama', coords: '-1.9783,30.1158' },
    { name: 'Gahanga', coords: '-2.0139,30.1344' },
    { name: 'Rebero', coords: '-1.9658,30.1242' },
    
    // Major Landmarks & Institutions
    { name: 'Kigali International Airport', coords: '-1.9686,30.1394' },
    { name: 'University of Rwanda', coords: '-1.9536,30.0906' },
    { name: 'Kigali Convention Centre', coords: '-1.9511,30.0928' },
    { name: 'King Faisal Hospital', coords: '-1.9439,30.0600' },
    { name: 'Kigali City Tower', coords: '-1.9536,30.0594' },
    { name: 'Union Trade Centre', coords: '-1.9536,30.0606' },
    { name: 'Kigali Genocide Memorial', coords: '-1.9381,30.0892' },
    
    // Markets & Shopping
    { name: 'Kimironko Market', coords: '-1.9314,30.1194' },
    { name: 'Nyabugogo Market', coords: '-1.9444,30.0444' },
    { name: 'Nyamirambo Market', coords: '-1.9803,30.0514' },
    { name: 'City Plaza', coords: '-1.9536,30.0606' },
    
    // Transport Hubs
    { name: 'Nyabugogo Bus Terminal', coords: '-1.9444,30.0444' },
    { name: 'Remera Taxi Park', coords: '-1.9526,30.0953' },
    { name: 'Kimironko Taxi Park', coords: '-1.9314,30.1194' },
    { name: 'Kicukiro Taxi Park', coords: '-1.9706,30.1044' },
  ];

  // Convert location name to coordinates if needed
  const getCoordinates = (input) => {
    // Check if input is already coordinates (contains comma and numbers)
    if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(input)) {
      return input;
    }
    
    // Try to find matching location
    const location = popularLocations.find(
      loc => loc.name.toLowerCase() === input.toLowerCase()
    );
    
    return location ? location.coords : input;
  };

  const handlePlanTrip = async (e) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }

    // Convert location names to coordinates
    const originCoords = getCoordinates(origin);
    const destCoords = getCoordinates(destination);
    
    // Validate coordinate format
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    if (!coordPattern.test(originCoords)) {
      toast.error('Invalid origin format. Use coordinates (e.g., -1.9441,30.0619) or select from suggestions');
      return;
    }
    if (!coordPattern.test(destCoords)) {
      toast.error('Invalid destination format. Use coordinates (e.g., -1.9307,30.1182) or select from suggestions');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/routes/plan?origin=${encodeURIComponent(originCoords)}&destination=${encodeURIComponent(destCoords)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Backend returns 'options' not 'routes'
        setRoutes(data.options || []);
        if (!data.options || data.options.length === 0) {
          toast.error(t('plan.noResults'));
        } else {
          toast.success(`Found ${data.options.length} route options`);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t('errors.network'));
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin(`${position.coords.latitude},${position.coords.longitude}`);
          toast.success('Current location set');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(t('errors.location'));
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus':
        return <Bus className="w-5 h-5" />;
      case 'taxi':
        return <Car className="w-5 h-5" />;
      case 'moto':
        return <Bike className="w-5 h-5" />;
      default:
        return <Navigation className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg">
                {t('plan.title')}
              </h1>
              <p className="text-white/90 text-lg">
                Plan your journey across Kigali with multiple route options
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/route-planning.svg" 
                alt="Route Planning" 
                className="w-64 h-64 mx-auto drop-shadow-xl animate-bounce-in"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="card">
              <form onSubmit={handlePlanTrip}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="origin-suggestions"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Type location name or coordinates"
                      className="input pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <datalist id="origin-suggestions">
                      {popularLocations.map((loc) => (
                        <option key={loc.name} value={loc.name} />
                      ))}
                    </datalist>
                  </div>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Use Current Location
                  </button>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Select from suggestions or enter coordinates (e.g., -1.9441,30.0619)
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="destination-suggestions"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Type location name or coordinates"
                      className="input pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <datalist id="destination-suggestions">
                      {popularLocations.map((loc) => (
                        <option key={loc.name} value={loc.name} />
                      ))}
                    </datalist>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Select from suggestions or enter coordinates (e.g., -1.9307,30.1182)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Navigation size={20} />
                  <span>{loading ? t('plan.searching') : 'Find Routes'}</span>
                </button>
              </form>
            </div>

            {/* Route Options Info */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('plan.routeOptions.title')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">{t('plan.routeOptions.fastest')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-accent-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">{t('plan.routeOptions.cheapest')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-secondary-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">{t('plan.routeOptions.mostConvenient')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="card">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-neutral-600 dark:text-neutral-300">{t('plan.searching')}</p>
                </div>
              </div>
            ) : routes.length > 0 ? (
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <div key={index} className="card hover:shadow-strong transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          {getVehicleIcon(route.mode)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-white capitalize">
                            {route.mode || 'Mixed'} Route
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            {route.steps?.length || 1} {route.steps?.length === 1 ? 'step' : 'steps'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {route.estimated_fare || '500'} RWF
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">{t('plan.tripDetails.duration')}</span>
                        </div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {route.duration_minutes || '25'} min
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 mb-1">
                          <Navigation className="w-4 h-4" />
                          <span className="text-xs">{t('plan.tripDetails.distance')}</span>
                        </div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {route.distance_km?.toFixed(1) || '8.5'} km
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs">{t('plan.tripDetails.fare')}</span>
                        </div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {route.estimated_fare || '500'} RWF
                        </p>
                      </div>
                    </div>

                    <button className="btn-primary w-full">
                      {t('plan.startTrip')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <Navigation className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-300 mb-2">
                    Enter your origin and destination to find routes
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    We'll show you the best options for your journey
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTripPage;
