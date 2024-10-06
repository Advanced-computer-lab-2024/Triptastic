// src/MapPicker.js

// src/MapPicker.js

import React, { useCallback, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const MapPicker = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 }); // Default coordinates
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const searchBoxRef = useRef(null); // Create a ref for the StandaloneSearchBox

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
    onLocationSelect(newPosition);
  }, [onLocationSelect]);

  const handlePlaceChanged = () => {
    const place = searchBoxRef.current.getPlaces()[0];
    if (place) {
      const location = place.geometry.location;
      const newPosition = { lat: location.lat(), lng: location.lng() };
      setMarkerPosition(newPosition);
      setMapCenter(newPosition);
      onLocationSelect(newPosition);
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={['places']}>
      <StandaloneSearchBox
        onLoad={ref => (searchBoxRef.current = ref)} // Store the ref in searchBoxRef
        onPlacesChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a location"
          style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '240px', height: '32px', paddingLeft: '10px', marginTop: '10px', marginBottom: '10px' }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        onClick={onMapClick}
        mapContainerStyle={{ height: '400px', width: '800px' }}
        center={mapCenter}
        zoom={15}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapPicker;
