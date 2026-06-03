
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: [number, number];
  readonly?: boolean;
}

const LocationMarker = ({ 
  onLocationSelect, 
  selectedLocation 
}: { 
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: [number, number];
}) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return selectedLocation ? <Marker position={selectedLocation} /> : null;
};

export const Map = ({ 
  center = [6.2442, -75.5812], // Default to Medellin
  zoom = 13, 
  onLocationSelect, 
  selectedLocation,
  readonly = false
}: MapProps) => {
  return (
    <MapContainer 
      center={selectedLocation || center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {readonly ? (
        selectedLocation && <Marker position={selectedLocation} />
      ) : (
        <LocationMarker 
          onLocationSelect={onLocationSelect} 
          selectedLocation={selectedLocation} 
        />
      )}
    </MapContainer>
  );
};
