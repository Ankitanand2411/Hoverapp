
import React, { useState } from "react";
import LeafletMap from "@/components/LeafletMap";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RouteControlPanel from "@/components/RouteControlPanel";
import RouteStats from "@/components/RouteStats";
import { useRouteSimulation } from "@/hooks/useRouteSimulation";

const DEFAULT_SPEED = 28; // km/h
const BATTERY_TOTAL = 100; // %

const RoutePlanner = () => {
  const [origin, setOrigin] = useState<[number, number]>();
  const [destination, setDestination] = useState<[number, number]>();
  const [routePath, setRoutePath] = useState<[number, number][]>();
  const [simulationActive, setSimulationActive] = useState(false);
  const [showPicker, setShowPicker] = useState<"origin" | "destination" | null>(null);
  const [vehicleType, setVehicleType] = useState<"bike" | "delivery-bot">("bike");

  // Handles the click/tap set of the start or end point
  const handleMapPick = (point: [number, number]) => {
    if (showPicker === "origin") {
      setOrigin(point);
      setShowPicker(null);
    } else if (showPicker === "destination") {
      setDestination(point);
      setShowPicker(null);
    }
  };

  // Generate straight line (could be more complex) as routePath
  React.useEffect(() => {
    if (origin && destination) {
      setRoutePath([
        origin,
        destination,
      ]);
    }
  }, [origin, destination]);

  const {
    vehiclePosition,
    speed,
    setSpeed,
    distanceCovered,
    battery,
    setBattery,
  } = useRouteSimulation({
    defaultSpeed: DEFAULT_SPEED,
    batteryTotal: BATTERY_TOTAL,
    origin,
    destination,
    routePath,
    simulationActive,
    onSimulationEnd: () => setSimulationActive(false),
  });

  const canStart = !!origin &&
    !!destination &&
    !simulationActive &&
    origin[0] !== destination[0] &&
    origin[1] !== destination[1];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pb-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold cyber-text mb-2 text-center">
          🚀 Vehicle Route Simulator
        </h1>
        <p className="text-muted-foreground text-center">
          Set a start and end point on the map, then watch your <span className="font-bold">{vehicleType === "bike" ? "Bike" : "Delivery Bot"}</span> move along the route. Stats live-update!
        </p>
      </div>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Select Route</CardTitle>
          <CardDescription>
            Tap <span className="font-semibold">[Set Origin]</span> or <span className="font-semibold">[Set Destination]</span> then click on the map
          </CardDescription>
        </CardHeader>
      </Card>
      <RouteControlPanel
        origin={origin}
        destination={destination}
        onPickOrigin={() => setShowPicker("origin")}
        onPickDestination={() => setShowPicker("destination")}
        onStart={() => {
          setSimulationActive(true);
        }}
        simulationActive={simulationActive}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        canStart={canStart}
      />
      <LeafletMap
        origin={origin}
        destination={destination}
        vehiclePosition={vehiclePosition}
        simulationActive={simulationActive}
        showPicker={showPicker}
        onPickPoint={handleMapPick}
        routePath={routePath}
        vehicleType={vehicleType}
        followVehicle={!!vehiclePosition}
      />
      <RouteStats
        speed={speed}
        distanceCovered={distanceCovered}
        battery={battery}
      />

    </div>
  );
};

export default RoutePlanner;
