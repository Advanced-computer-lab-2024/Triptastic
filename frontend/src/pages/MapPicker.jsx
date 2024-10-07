import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const MapPicker = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const searchBoxRef = useRef(null);

  // Function to reverse geocode the lat/lng into a human-readable address
  const getAddressFromLatLng = async (lat, lng) => {
    const apiKey = 'AIzaSyBcUWv-rRndbYbtu10Z4GHE-NEY6NlWD0I'; // Your Google Maps API key
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
    try {
      const response = await fetch(geocodeURL);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address; // Return the first result's formatted address
      } else {
        console.error('No valid address found');
        return '';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };
 

  const onMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };

    setMarkerPosition(newPosition);
    setMapCenter(newPosition);

    const address = await getAddressFromLatLng(lat, lng);
    console.log("Selected address:", address); // Add this line
    onLocationSelect(address); // Pass the address string to the parent component
  }, [onLocationSelect]);

  const handlePlaceChanged = async () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0 && places[0].geometry) {
      const place = places[0];
      const location = place.geometry.location;
      const newPosition = { lat: location.lat(), lng: location.lng() };

      setMarkerPosition(newPosition);
      setMapCenter(newPosition);

      const address = await getAddressFromLatLng(newPosition.lat, newPosition.lng);
      onLocationSelect(address); // Pass the address string to the parent component
    } else {
      console.error('No valid place or geometry found');
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBcUWv-rRndbYbtu10Z4GHE-NEY6NlWD0I" libraries={['places']}>
      <StandaloneSearchBox
        onLoad={(ref) => {
          searchBoxRef.current = ref;
        }}
        onPlacesChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a location"
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '32px',
            paddingLeft: '10px',
            marginTop: '10px',
            marginBottom: '10px'
          }}
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
