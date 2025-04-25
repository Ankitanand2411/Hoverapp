import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import L from "leaflet";
import { useEffect, useState } from "react";

// Default Marker Icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Props Type
interface MapProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
  mode: "origin" | "destination" | null;
  setOrigin: (point: [number, number]) => void;
  setDestination: (point: [number, number]) => void;
  setMode: (mode: "origin" | "destination" | null) => void;
}

// Component to handle map clicks
const LocationSelector = ({
  mode,
  setOrigin,
  setDestination,
  setMode,
}: {
  mode: "origin" | "destination" | null;
  setOrigin: (point: [number, number]) => void;
  setDestination: (point: [number, number]) => void;
  setMode: (mode: "origin" | "destination" | null) => void;
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (mode === "origin") {
        setOrigin([lat, lng]);
        setMode(null);
      } else if (mode === "destination") {
        setDestination([lat, lng]);
        setMode(null);
      }
    },
  });
  return null;
};

const Map = ({
  origin,
  destination,
  mode,
  setOrigin,
  setDestination,
  setMode,
}: MapProps) => {
  const mapCenter: [number, number] = origin || [28.61, 77.22];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Route Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] bg-card/50 rounded-md relative overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ width: "100%", height: "400px", borderRadius: "0.5rem" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <LocationSelector
              mode={mode}
              setOrigin={setOrigin}
              setDestination={setDestination}
              setMode={setMode}
            />

            {origin && (
              <Marker position={origin} icon={defaultIcon}>
                <Popup>Start Point</Popup>
              </Marker>
            )}
            {destination && (
              <Marker position={destination} icon={defaultIcon}>
                <Popup>Destination</Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-cyber-radial opacity-50"></div>
          <div className="absolute bottom-4 right-4 bg-card/70 p-2 rounded-md text-xs z-10">
            <div className="mb-2">Map Legend</div>
            <div className="flex items-center mb-1">
              <div className="h-1 w-5 bg-cyber-bright-purple mr-2"></div>
              <span>Primary Route</span>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-5 bg-cyber-blue mr-2 border-b border-dashed border-cyber-blue"></div>
              <span>Alternative Route</span>
            </div>
          </div>

          {/* Marker Legend */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
            <div className="bg-card/70 p-2 rounded-md text-xs flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-cyber-bright-purple mr-2"></span>
              <span>Start Point</span>
            </div>
            <div className="bg-card/70 p-2 rounded-md text-xs flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-cyber-blue mr-2"></span>
              <span>Destination</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Map;

