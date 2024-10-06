// MapPicker.js

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapPicker = ({ onLocationSelect }) => {
  const [location, setLocation] = useState({ lat: -34.397, lng: 150.644 }); // Default location

  const mapContainerStyle = {
    height: "400px",
    width: "100%"
  };

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setLocation(newLocation);
    onLocationSelect(newLocation); // Pass selected location to parent
  };

  return (
  
   
    <LoadScript googleMapsApiKey="b453fd7943b74f569862b5c633359cee74bfb545">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={location}
        onClick={handleMapClick}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapPicker;
