import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Bus, Car, Bike, RefreshCw, Map } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MapPage = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 }); // Kigali center

  useEffect(() => {
    getCurrentLocation();
    fetchNearbyVehicles();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(t('errors.location'));
        }
      );
    }
  };

  const fetchNearbyVehicles = async () => {
    try {
      setLoading(true);
      const lat = userLocation?.lat || mapCenter.lat;
      const lng = userLocation?.lng || mapCenter.lng;
      
      const response = await fetch(`/api/v1/vehicles/nearby?lat=${lat}&lng=${lng}&radius=5.0`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
      } else {
        toast.error(t('errors.network'));
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bus':
        return <Bus className="w-4 h-4" />;
      case 'taxi':
        return <Car className="w-4 h-4" />;
      case 'moto':
        return <Bike className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'bus':
        return 'bg-bus';
      case 'taxi':
        return 'bg-taxi';
      case 'moto':
        return 'bg-moto';
      default:
        return 'bg-neutral-500';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white mb-2">
            {t('map.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {userLocation ? 'Showing vehicles near your location' : 'Enable location to see nearby vehicles'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="h-96 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-300">{t('map.loading')}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Map className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Google Maps integration coming soon
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Set REACT_APP_GOOGLE_MAPS_KEY to enable map
                    </p>
                  </div>
                )}
              </div>
              
              {/* Map Controls */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center">
                  <button
                    onClick={getCurrentLocation}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <MapPin size={16} />
                    <span>Current Location</span>
                  </button>
                  
                  <button
                    onClick={fetchNearbyVehicles}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('map.nearbyVehicles')}
              </h2>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : vehicles.length > 0 ? (
                <div className="space-y-3">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 ${getVehicleColor(vehicle.vehicle_type)} rounded-full flex items-center justify-center text-white`}>
                          {getVehicleIcon(vehicle.vehicle_type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-white capitalize">
                            {vehicle.vehicle_type}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            {vehicle.registration}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400">Distance:</span>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {vehicle.distance_km} km
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400">ETA:</span>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {vehicle.eta_minutes} min
                          </p>
                        </div>
                      </div>
                      
                      {vehicle.operator && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                          Operator: {vehicle.operator}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {t('map.noVehicles')}
                  </p>
                  <button
                    onClick={fetchNearbyVehicles}
                    className="btn-outline mt-4"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                {t('map.legend.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-bus rounded-full flex items-center justify-center">
                    <Bus className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.bus')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-taxi rounded-full flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.taxi')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-moto rounded-full flex items-center justify-center">
                    <Bike className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{t('map.legend.moto')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
