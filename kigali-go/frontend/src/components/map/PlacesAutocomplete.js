/**
 * Google Places Autocomplete Component
 * Provides address autocomplete using Google Places API
 */

import React, { useRef, useEffect, useState } from 'react';
import { TextField, Autocomplete, Box, CircularProgress } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const PlacesAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  label,
  placeholder,
  startIcon,
  error,
  helperText,
  disabled = false,
  ...otherProps
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Places API not loaded');
      return;
    }

    if (!inputRef.current) return;

    // Initialize Autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'rw' }, // Restrict to Rwanda
        fields: ['geometry', 'formatted_address', 'name', 'place_id'],
      }
    );

    autocompleteRef.current = autocomplete;

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.warn('No geometry data for selected place');
        return;
      }

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name,
        place_id: place.place_id,
        name: place.name,
      };

      setInputValue(place.formatted_address || place.name || '');
      
      if (onPlaceSelect) {
        onPlaceSelect(location);
      }
      
      if (onChange) {
        onChange(place.formatted_address || place.name || '');
      }
    });

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onPlaceSelect]);

  // Update input value when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        error={error}
        helperText={helperText}
        disabled={disabled}
        InputProps={{
          startAdornment: startIcon || <LocationOn sx={{ mr: 1, color: '#0D7377' }} />,
          endAdornment: loading ? <CircularProgress size={20} /> : null,
        }}
        {...otherProps}
      />
    </Box>
  );
};

export default PlacesAutocomplete;


