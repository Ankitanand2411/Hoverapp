
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import { useEffect } from 'react';
import { Bike, Bot } from "lucide-react";
import { useMap } from 'react-leaflet';

const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Pulse animated icon for vehicle
const createHtmlVehicleIcon = (iconType: 'bike' | 'delivery-bot') =>
  icon({
    iconUrl: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: 'pulse-marker',
    html: `<div class="relative z-20 flex items-center justify-center text-cyber-bright-purple" style="width:36px; height:36px; font-size:32px;">
      ${iconType === "bike"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#9b87f5" stroke-width="2" class="lucide lucide-bike"><circle cx="5.5" cy="18.5" r="3.5"/><circle cx="18.5" cy="18.5" r="3.5"/><path d="M5.5 18.5h13l-4-6m0-4.5v4.5"/><path d="M9 18.5a2 2 0 0 1 2-2h3"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#9b87f5" stroke-width="2" class="lucide lucide-bot"><rect width="18" height="10" x="7" y="9" rx="2"/><circle cx="12" cy="13" r="1"/><circle cx="20" cy="13" r="1"/><path d="m22 19-3-3-2 2-2-2-3 3"/><path d="M16 9v2"/></svg>'}
    </div>`
  });

// Allow selecting points on map if enabled
const PointPicker = ({
  onPick,
  disabled,
}: {
  onPick: (latlng: [number, number]) => void;
  disabled?: boolean;
}) => {
  useMapEvents({
    click(e) {
      if (!disabled) onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

function MapFollowVehicle({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);
  return null;
}

interface LeafletMapProps {
  origin?: [number, number];
  destination?: [number, number];
  vehiclePosition?: [number, number];
  simulationActive?: boolean;
  showStats?: boolean;
  routePath?: [number, number][];
  showPicker?: 'origin' | 'destination' | null;
  onPickPoint?: (point: [number, number]) => void;
  vehicleType?: "bike" | "delivery-bot";
  followVehicle?: boolean;
}

const LeafletMap = ({
  origin,
  destination,
  vehiclePosition,
  simulationActive = false,
  showStats = true,
  routePath,
  showPicker,
  onPickPoint,
  vehicleType = "bike",
  followVehicle = false,
}: LeafletMapProps) => {
  const defaultCenter: [number, number] = [28.61, 77.22];
  const initialCenter = origin || vehiclePosition || destination || defaultCenter;

  return (
    <div className="relative">
      {/* @ts-ignore - Ignoring type issues with react-leaflet components */}
      <MapContainer
        center={initialCenter}
        zoom={15}
        style={{ width: '100%', height: '50vw', maxHeight: 500, minHeight: 320, borderRadius: '1rem' }}
        className="z-0"
      >
        {/* @ts-ignore - Ignoring type issues with react-leaflet components */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {showPicker && onPickPoint && (
          <PointPicker onPick={onPickPoint} disabled={false} />
        )}
        {origin && (
          /* @ts-ignore - Ignoring type issues with react-leaflet components */
          <Marker position={origin} icon={defaultIcon}>
            <Popup>Start Point</Popup>
          </Marker>
        )}
        {destination && (
          /* @ts-ignore - Ignoring type issues with react-leaflet components */
          <Marker position={destination} icon={defaultIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {routePath && routePath.length > 1 && (
          /* @ts-ignore - Ignoring type issues with react-leaflet components */
          <Polyline positions={routePath} pathOptions={{ color: "#9b87f5", weight: 5, opacity: 0.8 }} />
        )}
        {vehiclePosition && simulationActive && (
          /* @ts-ignore - Ignoring type issues with react-leaflet components */
          <Marker
            position={vehiclePosition}
            icon={createHtmlVehicleIcon(vehicleType)}
          />
        )}
        {followVehicle && vehiclePosition && (
          <MapFollowVehicle position={vehiclePosition} />
        )}
      </MapContainer>
      <style>{`
        .pulse-marker {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          60% { transform: scale(1.15); opacity: 0.85; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
