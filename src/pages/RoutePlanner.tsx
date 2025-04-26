
import React, { useState } from "react";
import { getShortestRoute } from "@/utils/routeUtils";
import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouteSimulation } from "@/hooks/useRouteSimulation";
import { searchLocation } from "@/utils/geocoding";

const DEFAULT_SPEED = 28; // km/h
const BATTERY_TOTAL = 100; // %

const RoutePlanner = () => {
  const [origin, setOrigin] = useState<[number, number]>();
  const [destination, setDestination] = useState<[number, number]>();
  const [routePath, setRoutePath] = useState<[number, number][]>();
  const [simulationActive, setSimulationActive] = useState(false);
  const [showPicker, setShowPicker] = useState<"origin" | "destination" | null>(null);
  const [vehicleType, setVehicleType] = useState<"bike" | "delivery-bot">("bike");
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ lat: number; lon: number; display_name: string }[]>([]);
  const [searchingFor, setSearchingFor] = useState<"origin" | "destination" | null>(null);

  // Handles the click/tap set of the start or end point
  const handleMapPick = (point: [number, number]) => {
    if (showPicker === "origin") {
      setOrigin(point);
      setShowPicker(null);
      setOriginSearch("");
    } else if (showPicker === "destination") {
      setDestination(point);
      setShowPicker(null);
      setDestinationSearch("");
    }
  };

  // Handle location search
  const handleSearch = async (query: string, type: "origin" | "destination") => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearchingFor(type);
    const results = await searchLocation(query);
    setSearchResults(results);
  };

  // Handle search result selection
  const handleSelectLocation = (result: { lat: number; lon: number }) => {
    const point: [number, number] = [result.lat, result.lon];
    if (searchingFor === "origin") {
      setOrigin(point);
      setOriginSearch("");
    } else if (searchingFor === "destination") {
      setDestination(point);
      setDestinationSearch("");
    }
    setSearchResults([]);
    setSearchingFor(null);
  };

  // Calculate shortest route when origin and destination are set
  React.useEffect(() => {
    async function calculateRoute() {
      if (origin && destination) {
        try {
          const route = await getShortestRoute(origin, destination, vehicleType);
          setRoutePath(route);
        } catch (error) {
          console.error('Failed to calculate route:', error);
          // Fallback to straight line
          setRoutePath([origin, destination]);
        }
      }
    }
    calculateRoute();
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
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pb-8 space-y-4">
      <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex flex-col items-center gap-4 py-4">
          <h1 className="text-3xl font-bold cyber-text">Route Planner</h1>
          <p className="text-muted-foreground mb-4">Plan and simulate your shortest Route</p>
          <div className="w-full max-w-sm space-y-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search origin location"
                    value={originSearch}
                    onChange={(e) => {
                      setOriginSearch(e.target.value);
                      handleSearch(e.target.value, "origin");
                    }}
                    disabled={simulationActive}
                  />
                </div>
                <Button
                  variant={showPicker === "origin" ? "default" : "outline"}
                  onClick={() => setShowPicker("origin")}
                  disabled={simulationActive}
                >
                  Pick on Map
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search destination location"
                    value={destinationSearch}
                    onChange={(e) => {
                      setDestinationSearch(e.target.value);
                      handleSearch(e.target.value, "destination");
                    }}
                    disabled={simulationActive}
                  />
                </div>
                <Button
                  variant={showPicker === "destination" ? "default" : "outline"}
                  onClick={() => setShowPicker("destination")}
                  disabled={simulationActive}
                >
                  Pick on Map
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full max-w-sm bg-background border rounded-md shadow-lg mt-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm"
                      onClick={() => handleSelectLocation(result)}
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <div className="w-full h-[700px] relative rounded-lg overflow-hidden border">
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
      </div>
      <div className="w-full max-w-sm space-y-2">
        <div className="grid w-full items-center gap-2">
          {origin && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Origin:</span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {origin[0].toFixed(4)}, {origin[1].toFixed(4)}
              </code>
            </div>
          )}
          {destination && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Destination:</span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {destination[0].toFixed(4)}, {destination[1].toFixed(4)}
              </code>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default RoutePlanner;
