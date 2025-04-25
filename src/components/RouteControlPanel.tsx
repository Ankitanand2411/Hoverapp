import LeafletMap from './LeafletMap';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bike, Bot } from "lucide-react";
import React, { useState } from "react";

interface RouteControlPanelProps {
  origin?: [number, number];
  destination?: [number, number];
  onPickOrigin: () => void;
  onPickDestination: () => void;
  onStart: () => void;
  simulationActive?: boolean;
  vehicleType: "bike" | "delivery-bot";
  setVehicleType: (val: "bike" | "delivery-bot") => void;
  canStart: boolean;
  routePath?: [number, number][];
  vehiclePosition?: [number, number];
  followVehicle?: boolean;
  showPicker?: "origin" | "destination" | null;
  onPickPoint?: (point: [number, number]) => void;
}

const RouteControlPanel: React.FC<RouteControlPanelProps> = ({
  origin,
  destination,
  onPickOrigin,
  onPickDestination,
  onStart,
  simulationActive,
  vehicleType,
  setVehicleType,
  canStart,
  routePath,
  vehiclePosition,
  followVehicle = false,
  showPicker,
  onPickPoint
}) => {
  const [internalOrigin, setInternalOrigin] = useState<string>("");
  const [internalDestination, setInternalDestination] = useState<string>("");

  React.useEffect(() => {
    if (origin) {
      setInternalOrigin(`${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}`);
    }
    if (destination) {
      setInternalDestination(`${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}`);
    }
  }, [origin, destination]);

  return (
    <div className="flex flex-col gap-4">
      {/* --- Control Buttons & Inputs --- */}
      <div>
        <div className="flex gap-2 mb-2">
          <Button
            variant={vehicleType === "bike" ? "default" : "outline"}
            onClick={() => setVehicleType("bike")}
          >
            <Bike className="mr-2" /> Bike
          </Button>
          <Button
            variant={vehicleType === "delivery-bot" ? "default" : "outline"}
            onClick={() => setVehicleType("delivery-bot")}
          >
            <Bot className="mr-2" /> Delivery Bot
          </Button>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center">
            <Label className="min-w-[80px]">Origin:</Label>
            <Input
              className="text-xs"
              value={internalOrigin}
              placeholder="Select on map"
              readOnly
            />
            <Button
              size="sm"
              variant="outline"
              onClick={onPickOrigin}
              disabled={simulationActive}
            >
              Set Origin
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="min-w-[80px]">Destination:</Label>
            <Input
              className="text-xs"
              value={internalDestination}
              placeholder="Select on map"
              readOnly
            />
            <Button
              size="sm"
              variant="outline"
              onClick={onPickDestination}
              disabled={simulationActive}
            >
              Set Destination
            </Button>
          </div>
          <Button
            className="w-full mt-4 bg-cyber-purple neon-button"
            disabled={!canStart}
            onClick={onStart}
          >
            {simulationActive ? "Simulating..." : "Start Simulation"}
          </Button>
        </div>
      </div>

      {/* --- Leaflet Map Section --- */}
      <LeafletMap
        origin={origin}
        destination={destination}
        simulationActive={simulationActive}
        vehicleType={vehicleType}
        routePath={routePath}
        vehiclePosition={vehiclePosition}
        followVehicle={followVehicle}
        showPicker={showPicker}
        onPickPoint={onPickPoint}
      />
    </div>
  );
};

export default RouteControlPanel;
