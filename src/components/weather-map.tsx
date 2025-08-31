
'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default markers in react-leaflet. This should be done only once.
if (Icon.Default.prototype instanceof Icon) {
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}


// Component to handle map view updates when props change.
// This is the recommended way to control the map view from a parent component.
function MapViewUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

const WeatherMap = ({ lat, lon }: { lat: number, lon: number }) => {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders on the client, as Leaflet needs the window object.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  // Display a placeholder while waiting for the client-side to render.
  if (!isClient) {
    return (
      <div 
        className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"
        style={{ height: '400px', borderRadius: '0.75rem' }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    // MapContainer should only be rendered once. We will not use a key to force re-renders.
    <MapContainer
      center={[lat, lon]}
      zoom={7}
      style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Temperature">
          <TileLayer url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d8b3c706b297e5b23d52af124f7b494d" />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Precipitation">
          <TileLayer url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=d8b3c706b297e5b23d52af124f7b494d" />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Wind Speed">
          <TileLayer url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=d8b3c706b297e5b23d52af124f7b494d" />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Clouds">
          <TileLayer url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=d8b3c706b297e5b23d52af124f7b494d" />
        </LayersControl.Overlay>
      </LayersControl>
      <Marker position={[lat, lon]} icon={customIcon}>
        <Popup>
          Currently viewing this location.
        </Popup>
      </Marker>
      {/* This component will handle all view updates without re-initializing the map */}
      <MapViewUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
};

export default WeatherMap;
