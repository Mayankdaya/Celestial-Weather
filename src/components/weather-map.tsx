'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon } from 'leaflet';

const WeatherMap = ({ lat, lon }: { lat: number, lon: number }) => {

  const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <MapContainer center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }} key={`${lat}-${lon}`}>
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
    </MapContainer>
  );
};

export default WeatherMap;
