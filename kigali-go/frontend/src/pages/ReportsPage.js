import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, MapPin, Camera, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: 'overcharge',
    title: '',
    description: '',
    location: '',
    vehicle_registration: ''
  });
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'overcharge', label: t('reports.types.overcharge') },
    { id: 'safety', label: t('reports.types.safety') },
    { id: 'service', label: t('reports.types.service') },
    { id: 'other', label: t('reports.types.other') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error(t('errors.validation'));
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Report submitted successfully! Thank you for your feedback.', {
          duration: 4000,
          icon: '✅'
        });
        console.log('Report submitted:', data);
        
        // Reset form
        setFormData({
          type: 'overcharge',
          title: '',
          description: '',
          location: '',
          vehicle_registration: ''
        });
      } else {
        toast.error(data.error || 'Failed to submit report. Please try again.', {
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Network error. Please check your connection and try again.', {
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude},${position.coords.longitude}`
          }));
          toast.success('Location set');
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-3 drop-shadow-lg">
                {t('reports.title')}
              </h1>
              <p className="text-white/90 text-lg">
                Help us improve transport services by reporting issues
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/safety-illustration.svg" 
                alt="Safety Reports" 
                className="w-64 h-64 mx-auto drop-shadow-xl animate-scale-in"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {t('reports.newReport')}
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.type')}
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input"
                  >
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.titleField')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief title for the issue"
                    className="input"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                    rows="5"
                    className="input"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.location')}
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location or use current"
                        className="input pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    </div>
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="btn-outline px-4"
                    >
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.vehicleRegistration')}
                  </label>
                  <input
                    type="text"
                    name="vehicle_registration"
                    value={formData.vehicle_registration}
                    onChange={handleChange}
                    placeholder="e.g., RAD 123 A (optional)"
                    className="input"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {t('reports.vehicle')}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('reports.photo')}
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                    <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG up to 5MB
                    </p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>{loading ? t('reports.submitting') : t('reports.submit')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                Report Guidelines
              </h3>
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Be Specific
                  </h4>
                  <p>Provide as much detail as possible about the incident</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Stay Respectful
                  </h4>
                  <p>Use respectful language when describing the issue</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Include Evidence
                  </h4>
                  <p>Photos and vehicle details help us investigate faster</p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Follow Up
                  </h4>
                  <p>We'll notify you about the status of your report</p>
                </div>
              </div>
            </div>

            <div className="card mt-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <h3 className="text-lg font-semibold mb-2 text-primary-900 dark:text-primary-200">
                Emergency?
              </h3>
              <p className="text-sm text-primary-800 dark:text-primary-300 mb-3">
                For urgent safety concerns, please contact:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-400">Police:</span>
                  <span className="font-semibold text-primary-900 dark:text-primary-200">112</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-400">Emergency:</span>
                  <span className="font-semibold text-primary-900 dark:text-primary-200">999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
