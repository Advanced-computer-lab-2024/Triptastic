import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const MapPicker = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const searchBoxRef = useRef(null);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
    setMapCenter(newPosition);
    onLocationSelect(newPosition);
  }, [onLocationSelect]);

  const handlePlaceChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    console.log("Places returned: ", places); // Debugging log

    if (places && places.length > 0 && places[0].geometry) {
      const place = places[0];
      const location = place.geometry.location;

      console.log("Location: ", location); // Debugging log
      const newPosition = { lat: location.lat(), lng: location.lng() };
      setMarkerPosition(newPosition);
      setMapCenter(newPosition);
      console.log("New marker position: ", newPosition); // Debugging log
      onLocationSelect(newPosition); // Send the selected location back to parent
    } else {
      console.error('No valid place or geometry found');
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD6QjQrBoCP9HJElNBpar1xz9yHABy2emc" libraries={['places']}>
      <StandaloneSearchBox
        onLoad={(ref) => {
          searchBoxRef.current = ref;
          console.log("SearchBox Loaded: ", searchBoxRef.current); // Debugging log
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
