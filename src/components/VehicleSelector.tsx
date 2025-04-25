
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

interface VehicleStats {
  batteryCapacity: number; // kWh
  maxSpeed: number; // km/h
  payload: number; // kg
  range: number; // km
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
  image: string;
  baseStats: VehicleStats;
}

const vehicles: VehicleType[] = [
  {
    id: "hoverboard",
    name: "NeoGlide Hoverboard",
    description: "Agile personal transporter with advanced stabilization",
    image: "/placeholder.svg",
    baseStats: {
      batteryCapacity: 0.5,
      maxSpeed: 25,
      payload: 100,
      range: 20,
    }
  },
  {
    id: "scooter",
    name: "UrbanZip Scooter",
    description: "High-performance urban commuter with extended range",
    image: "/placeholder.svg",
    baseStats: {
      batteryCapacity: 1.2,
      maxSpeed: 40,
      payload: 120,
      range: 50,
    }
  },
  {
    id: "deliverybot",
    name: "CargoBot Delivery",
    description: "Autonomous delivery robot with intelligent obstacle avoidance",
    image: "/placeholder.svg",
    baseStats: {
      batteryCapacity: 2.5,
      maxSpeed: 20,
      payload: 200,
      range: 80,
    }
  }
];

interface VehicleCardProps {
  vehicle: VehicleType;
  isSelected: boolean;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, isSelected, onSelect }: VehicleCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? "border-cyber-bright-purple bg-secondary/40 animate-pulse-glow" 
          : "border-border hover:border-cyber-purple"
      }`}
      onClick={onSelect}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{vehicle.name}</CardTitle>
        <CardDescription>{vehicle.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-40 bg-secondary/30 rounded-md flex items-center justify-center mb-4">
          <div className="text-4xl text-cyber-bright-purple">
            {vehicle.id === "hoverboard" && "🛹"}
            {vehicle.id === "scooter" && "🛴"}
            {vehicle.id === "deliverybot" && "🤖"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Battery: {vehicle.baseStats.batteryCapacity} kWh</div>
          <div>Max Speed: {vehicle.baseStats.maxSpeed} km/h</div>
          <div>Payload: {vehicle.baseStats.payload} kg</div>
          <div>Range: {vehicle.baseStats.range} km</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full"
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const VehicleSelector = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("hoverboard");
  const [customizedStats, setCustomizedStats] = useState<VehicleStats>({
    batteryCapacity: 0.5,
    maxSpeed: 25,
    payload: 100,
    range: 20,
  });
  const navigate = useNavigate();

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicleId);
      setCustomizedStats(vehicle.baseStats);
    }
  };

  const handleStartSimulation = () => {
    // In a real app, we'd save this configuration
    const selectedVehicleData = {
      vehicleId: selectedVehicle,
      stats: customizedStats
    };
    
    // Simulate saving to local storage
    localStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicleData));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold cyber-text">Choose Your Vehicle</h2>
        <p className="text-muted-foreground">Select and customize your vehicle for the simulation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicle === vehicle.id}
            onSelect={() => handleVehicleSelect(vehicle.id)}
          />
        ))}
      </div>
      
      <Tabs defaultValue="battery" className="mt-8">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="battery">Battery</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="payload">Payload</TabsTrigger>
          <TabsTrigger value="range">Range</TabsTrigger>
        </TabsList>
        
        <TabsContent value="battery" className="space-y-4">
          <div className="p-4 border rounded-md bg-card">
            <h3 className="font-medium mb-2">Battery Capacity: {customizedStats.batteryCapacity} kWh</h3>
            <Slider
              min={0.2}
              max={5}
              step={0.1}
              value={[customizedStats.batteryCapacity]}
              onValueChange={([value]) => setCustomizedStats({...customizedStats, batteryCapacity: value})}
              className="my-4"
            />
            <div className="text-xs text-muted-foreground">
              Adjust the battery capacity to increase range at the expense of added weight
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="speed" className="space-y-4">
          <div className="p-4 border rounded-md bg-card">
            <h3 className="font-medium mb-2">Maximum Speed: {customizedStats.maxSpeed} km/h</h3>
            <Slider
              min={10}
              max={60}
              step={1}
              value={[customizedStats.maxSpeed]}
              onValueChange={([value]) => setCustomizedStats({...customizedStats, maxSpeed: value})}
              className="my-4"
            />
            <div className="text-xs text-muted-foreground">
              Higher maximum speed reduces range but decreases travel time
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payload" className="space-y-4">
          <div className="p-4 border rounded-md bg-card">
            <h3 className="font-medium mb-2">Payload Capacity: {customizedStats.payload} kg</h3>
            <Slider
              min={50}
              max={300}
              step={10}
              value={[customizedStats.payload]}
              onValueChange={([value]) => setCustomizedStats({...customizedStats, payload: value})}
              className="my-4"
            />
            <div className="text-xs text-muted-foreground">
              Increase payload capacity for more cargo at the expense of range
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="range" className="space-y-4">
          <div className="p-4 border rounded-md bg-card">
            <h3 className="font-medium mb-2">Range: {customizedStats.range} km</h3>
            <div className="text-xs text-muted-foreground mb-4">
              Range is calculated based on battery capacity, vehicle type, and weight
            </div>
            <div className="p-3 bg-secondary/30 rounded-md text-center">
              <div className="text-2xl font-bold text-cyber-bright-purple">{customizedStats.range} km</div>
              <div className="text-xs text-muted-foreground">Estimated Range</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="px-8 py-6 text-lg neon-button bg-cyber-purple hover:bg-cyber-purple/80"
          onClick={handleStartSimulation}
        >
          Start Simulation
        </Button>
      </div>
    </div>
  );
};
