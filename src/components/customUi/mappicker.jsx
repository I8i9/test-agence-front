import React, { useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton'


const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem',
  border: '1px solid #e2e8f0',
  marginTop: '8px',
};

const MapPicker = ({ value, onChange, prev }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA6MPJvuZk_FwLObsqTHZpcmZspro_gVh4",
    region: 'TN'
  });

  console.log("MapPicker value:", value , prev);

  const mapRef = useRef(null);
  const geocodeCache = useRef(new Map());

  // Centre par défaut (Tunis) ou valeur existante
  const center = {
    lat: value?.lat || prev?.lat || 36.8065,
    lng: value?.lng || prev?.lng || 10.1815
  };

  // Synchronisation : Déplacer la carte quand la recherche change
  useEffect(() => {
    if (mapRef.current && value?.lat && value?.lng) {
      mapRef.current.panTo({ lat: value.lat, lng: value.lng });
    }
  }, [value?.lat, value?.lng]);

  // Fonction de géocodage avec cache
  const geocodeLocation = useCallback((lat, lng) => {
    // Créer une clé arrondie pour le cache (précision ~11m)
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    
    // Vérifier si déjà en cache
    if (geocodeCache.current.has(key)) {
      const cachedAddress = geocodeCache.current.get(key);
      onChange({
        lat,
        lng,
        title: cachedAddress
      });
      return;
    }

    // Géocodage inverse pour obtenir l'adresse textuelle
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let title;
      if (status === "OK" && results[0]) {
        title = results[0].formatted_address;
      } else {
        title = `Position sélectionnée (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
      }
      
      // Mettre en cache
      geocodeCache.current.set(key, title);
      
      onChange({
        lat,
        lng,
        title
      });
    });
  }, [onChange]);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    geocodeLocation(lat, lng);
  }, [geocodeLocation]);

  // Gestionnaire pour le drag & drop du marker
  const onMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    geocodeLocation(lat, lng);
  }, [geocodeLocation]);

  if (!isLoaded) return <Skeleton className="h-[300px] w-full rounded-xl" />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={value?.lat ? 15 : prev?.lat ? 15 : 10}
      onClick={onMapClick}
      onLoad={(map) => (mapRef.current = map)}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {((value?.lat && value?.lng) || (prev?.lat && prev?.lng)) && (
        <Marker 
          position={{ lat: value?.lat || prev?.lat, lng: value?.lng || prev?.lng }}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      )}
    </GoogleMap>
  );
};

export default MapPicker;